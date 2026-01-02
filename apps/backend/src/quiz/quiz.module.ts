import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { EmailModule } from '../email/email.module';
import { CertificatesModule } from '../certificates/certificates.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, EmailModule, CertificatesModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
