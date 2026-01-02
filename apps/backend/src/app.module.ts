import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JourneysModule } from './journeys/journeys.module';
import { MissionsModule } from './missions/missions.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { CertificatesModule } from './certificates/certificates.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JourneysModule,
    MissionsModule,
    ProgressModule,
    QuizModule,
    CertificatesModule,
    EmailModule,
  ],
})
export class AppModule {}
