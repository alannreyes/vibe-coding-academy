import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseGuard } from './firebase.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseGuard],
  exports: [AuthService, FirebaseGuard],
})
export class AuthModule {}
