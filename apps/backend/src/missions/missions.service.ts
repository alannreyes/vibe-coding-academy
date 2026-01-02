import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
      include: {
        journey: true,
        cards: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async findByIdWithProgress(id: number, userId: string) {
    const mission = await this.findById(id);

    const progress = await this.prisma.missionProgress.findUnique({
      where: {
        userId_missionId: { userId, missionId: id },
      },
    });

    return {
      ...mission,
      status: progress?.status || 'locked',
      quizPassed: progress?.quizPassed || false,
      quizScore: progress?.quizScore || null,
      startedAt: progress?.startedAt || null,
      completedAt: progress?.completedAt || null,
    };
  }

  async startMission(missionId: number, userId: string) {
    // Check if mission is available
    const progress = await this.prisma.missionProgress.findUnique({
      where: {
        userId_missionId: { userId, missionId },
      },
    });

    if (!progress || progress.status === 'locked') {
      throw new ForbiddenException('Mission is not available');
    }

    if (progress.status === 'completed') {
      return progress; // Already completed
    }

    // Update to in_progress
    return this.prisma.missionProgress.update({
      where: {
        userId_missionId: { userId, missionId },
      },
      data: {
        status: 'in_progress',
        startedAt: progress.startedAt || new Date(),
      },
    });
  }

  async getCards(missionId: number, userId: string) {
    // Check if user has access
    const progress = await this.prisma.missionProgress.findUnique({
      where: {
        userId_missionId: { userId, missionId },
      },
    });

    if (!progress || progress.status === 'locked') {
      throw new ForbiddenException('Mission is not available');
    }

    return this.prisma.card.findMany({
      where: { missionId },
      orderBy: { order: 'asc' },
    });
  }
}
