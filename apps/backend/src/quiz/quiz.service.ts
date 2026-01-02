import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CertificatesService } from '../certificates/certificates.service';

const MAX_ATTEMPTS = 3;
const COOLDOWN_HOURS = 24;
const PASS_SCORE = 8;

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private certificatesService: CertificatesService,
  ) {}

  async getQuestions(missionId: number, userId: string) {
    // Check if mission is available
    const progress = await this.prisma.missionProgress.findUnique({
      where: {
        userId_missionId: { userId, missionId },
      },
    });

    if (!progress || progress.status === 'locked') {
      throw new ForbiddenException('Mission is not available');
    }

    const questions = await this.prisma.quizQuestion.findMany({
      where: { missionId },
      orderBy: { order: 'asc' },
    });

    // Return questions without correct answers
    return questions.map((q) => ({
      id: q.id,
      missionId: q.missionId,
      question: q.question,
      options: q.options,
      order: q.order,
    }));
  }

  async getQuizStatus(missionId: number, userId: string) {
    const recentAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        missionId,
        createdAt: {
          gte: new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const attemptsUsed = recentAttempts.length;
    const passed = recentAttempts.some((a) => a.passed);
    const bestScore = recentAttempts.length
      ? Math.max(...recentAttempts.map((a) => a.score))
      : undefined;

    let nextAttemptAt: Date | undefined;
    if (attemptsUsed >= MAX_ATTEMPTS && !passed) {
      const oldestAttempt = recentAttempts[recentAttempts.length - 1];
      nextAttemptAt = new Date(
        oldestAttempt.createdAt.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000,
      );
    }

    return {
      attemptsUsed,
      maxAttempts: MAX_ATTEMPTS,
      canAttempt: attemptsUsed < MAX_ATTEMPTS || passed,
      nextAttemptAt,
      bestScore,
      passed,
    };
  }

  async submitQuiz(
    missionId: number,
    userId: string,
    answers: Record<string, string>,
  ) {
    // Check attempts
    const status = await this.getQuizStatus(missionId, userId);

    if (!status.canAttempt && !status.passed) {
      throw new ForbiddenException(
        `Has agotado tus ${MAX_ATTEMPTS} intentos. Espera ${COOLDOWN_HOURS} horas.`,
      );
    }

    if (status.passed) {
      throw new ForbiddenException('Ya aprobaste este quiz');
    }

    // Get questions with correct answers
    const questions = await this.prisma.quizQuestion.findMany({
      where: { missionId },
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found for this mission');
    }

    // Calculate score
    let correct = 0;
    const results: Record<string, boolean> = {};
    const explanations: Record<string, string> = {};

    for (const q of questions) {
      const isCorrect = answers[q.id] === q.correctId;
      if (isCorrect) correct++;
      results[q.id] = isCorrect;
      if (!isCorrect && q.explanation) {
        explanations[q.id] = q.explanation;
      }
    }

    const score = correct;
    const passed = score >= PASS_SCORE;
    const attemptNumber = status.attemptsUsed + 1;

    // Calculate points based on attempt
    const pointsEarned = passed
      ? attemptNumber === 1
        ? 100
        : attemptNumber === 2
          ? 75
          : 50
      : 0;

    // Record attempt
    await this.prisma.quizAttempt.create({
      data: {
        userId,
        missionId,
        attemptNumber,
        score,
        passed,
        answers,
      },
    });

    // If passed, update progress
    let nextMissionUnlocked: number | undefined;

    if (passed) {
      // Update mission progress
      await this.prisma.missionProgress.update({
        where: {
          userId_missionId: { userId, missionId },
        },
        data: {
          status: 'completed',
          completedAt: new Date(),
          quizPassed: true,
          quizScore: score,
        },
      });

      // Add points to user
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalPoints: { increment: pointsEarned + 50 }, // +50 for completing mission
          currentMission: { increment: 1 },
        },
      });

      // Unlock next mission
      const nextMission = await this.prisma.mission.findFirst({
        where: { id: missionId + 1 },
      });

      if (nextMission) {
        await this.prisma.missionProgress.upsert({
          where: {
            userId_missionId: { userId, missionId: nextMission.id },
          },
          create: {
            userId,
            missionId: nextMission.id,
            status: 'available',
          },
          update: {
            status: 'available',
          },
        });
        nextMissionUnlocked = nextMission.id;
      }

      // Check if journey is complete
      await this.checkJourneyCompletion(userId, missionId);

      // Send email
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const mission = await this.prisma.mission.findUnique({
        where: { id: missionId },
      });
      if (user && mission) {
        await this.emailService.sendMissionCompleted(
          user,
          mission,
          pointsEarned + 50,
          nextMission?.title,
        );
      }
    }

    return {
      score,
      total: questions.length,
      passed,
      attemptsRemaining: passed ? 0 : MAX_ATTEMPTS - attemptNumber,
      pointsEarned: passed ? pointsEarned + 50 : 0,
      results,
      explanations: passed ? undefined : explanations,
      nextMissionUnlocked,
    };
  }

  private async checkJourneyCompletion(userId: string, missionId: number) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
      include: { journey: true },
    });

    if (!mission) return;

    const journeyMissions = await this.prisma.mission.findMany({
      where: { journeyId: mission.journeyId },
    });

    const completedCount = await this.prisma.missionProgress.count({
      where: {
        userId,
        missionId: { in: journeyMissions.map((m) => m.id) },
        status: 'completed',
      },
    });

    // If all missions in journey are completed
    if (completedCount === journeyMissions.length) {
      await this.certificatesService.generateCertificate(
        userId,
        mission.journeyId,
      );
    }
  }

  async getAttempts(missionId: number, userId: string) {
    return this.prisma.quizAttempt.findMany({
      where: {
        userId,
        missionId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
