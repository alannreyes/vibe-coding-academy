import { Module, forwardRef } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController, VerifyController } from './certificates.controller';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, forwardRef(() => EmailModule)],
  controllers: [CertificatesController, VerifyController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
