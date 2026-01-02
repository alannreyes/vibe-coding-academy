import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseGuard } from './firebase.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.loginOrRegister(loginDto.firebaseToken);
    return { user };
  }

  @Get('me')
  @UseGuards(FirebaseGuard)
  async me(@Request() req: any) {
    return { user: req.user };
  }
}
