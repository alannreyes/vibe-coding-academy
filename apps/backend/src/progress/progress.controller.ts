import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { FirebaseGuard } from '../auth/firebase.guard';

@Controller('progress')
@UseGuards(FirebaseGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  async getUserProgress(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.id);
  }

  @Get('journey/:id')
  async getJourneyProgress(@Param('id') id: string, @Request() req: any) {
    return this.progressService.getJourneyProgress(req.user.id, parseInt(id, 10));
  }
}
