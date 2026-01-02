import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          include: {
            mission: {
              include: {
                journey: true,
              },
            },
          },
        },
        certificates: true,
      },
    });

    if (!user) return null;

    // Calculate completed missions
    const completedMissions = user.progress.filter(
      (p) => p.status === 'completed',
    ).length;

    // Get all missions count
    const totalMissions = await this.prisma.mission.count();

    // Calculate journey progress
    const journeys = await this.prisma.journey.findMany({
      include: {
        missions: true,
      },
    });

    const journeyProgress = journeys.map((journey) => {
      const journeyMissionIds = journey.missions.map((m) => m.id);
      const completed = user.progress.filter(
        (p) =>
          journeyMissionIds.includes(p.missionId) && p.status === 'completed',
      ).length;

      const certificate = user.certificates.find(
        (c) => c.journeyId === journey.id,
      );

      return {
        journeyId: journey.id,
        completedMissions: completed,
        totalMissions: journey.missions.length,
        percentage: Math.round((completed / journey.missions.length) * 100),
        isCompleted: completed === journey.missions.length,
        certificateId: certificate?.id,
      };
    });

    return {
      totalPoints: user.totalPoints,
      currentJourney: user.currentJourney,
      currentMission: user.currentMission,
      completedMissions,
      totalMissions,
      certificates: user.certificates.length,
      journeys: journeyProgress,
    };
  }

  async getJourneyProgress(userId: string, journeyId: number) {
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
      include: {
        missions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!journey) return null;

    const missionProgress = await this.prisma.missionProgress.findMany({
      where: {
        userId,
        missionId: {
          in: journey.missions.map((m) => m.id),
        },
      },
    });

    const progressMap = new Map(missionProgress.map((p) => [p.missionId, p]));

    const missionsWithStatus = journey.missions.map((mission) => {
      const progress = progressMap.get(mission.id);
      return {
        ...mission,
        status: progress?.status || 'locked',
        quizPassed: progress?.quizPassed || false,
        quizScore: progress?.quizScore || null,
      };
    });

    const completed = missionProgress.filter(
      (p) => p.status === 'completed',
    ).length;

    return {
      ...journey,
      missions: missionsWithStatus,
      completedMissions: completed,
      percentage: Math.round((completed / journey.missions.length) * 100),
    };
  }
}
