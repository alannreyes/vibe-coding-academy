import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JourneysService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.journey.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.journey.findUnique({
      where: { id },
      include: {
        missions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findByIdWithUserProgress(id: number, userId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id },
      include: {
        missions: {
          orderBy: { order: 'asc' },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!journey) return null;

    // Transform missions with status
    const missionsWithStatus = journey.missions.map((mission) => {
      const progress = mission.progress[0];
      return {
        ...mission,
        status: progress?.status || 'locked',
        quizPassed: progress?.quizPassed || false,
        quizScore: progress?.quizScore || null,
        startedAt: progress?.startedAt || null,
        completedAt: progress?.completedAt || null,
        progress: undefined, // Remove the progress array
      };
    });

    return {
      ...journey,
      missions: missionsWithStatus,
    };
  }
}
