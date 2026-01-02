import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { FirebaseGuard } from '../auth/firebase.guard';

@Controller('missions')
@UseGuards(FirebaseGuard)
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.missionsService.findByIdWithProgress(
      parseInt(id, 10),
      req.user.id,
    );
  }

  @Post(':id/start')
  async startMission(@Param('id') id: string, @Request() req: any) {
    return this.missionsService.startMission(parseInt(id, 10), req.user.id);
  }

  @Get(':id/cards')
  async getCards(@Param('id') id: string, @Request() req: any) {
    return this.missionsService.getCards(parseInt(id, 10), req.user.id);
  }
}
