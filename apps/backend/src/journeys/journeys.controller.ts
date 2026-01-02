import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { FirebaseGuard } from '../auth/firebase.guard';

@Controller('journeys')
@UseGuards(FirebaseGuard)
export class JourneysController {
  constructor(private journeysService: JourneysService) {}

  @Get()
  async findAll() {
    return this.journeysService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.journeysService.findByIdWithUserProgress(
      parseInt(id, 10),
      req.user.id,
    );
  }
}
