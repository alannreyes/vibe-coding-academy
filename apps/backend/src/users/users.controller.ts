import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseGuard } from '../auth/firebase.guard';

interface UpdatePreferencesDto {
  operatingSystem?: 'windows' | 'mac' | 'linux';
  onboardingCompleted?: boolean;
}

@Controller('users')
@UseGuards(FirebaseGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(req.user.id, dto);
  }
}
