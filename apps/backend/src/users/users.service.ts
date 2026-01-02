import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        certificates: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePoints(userId: string, points: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: points },
      },
    });
  }

  async updateProgress(userId: string, missionId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        currentMission: missionId,
      },
    });
  }

  async updatePreferences(
    userId: string,
    data: {
      operatingSystem?: string;
      onboardingCompleted?: boolean;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
