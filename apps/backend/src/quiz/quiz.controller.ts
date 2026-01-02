import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FirebaseGuard } from '../auth/firebase.guard';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller('quiz')
@UseGuards(FirebaseGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get(':missionId')
  async getQuestions(@Param('missionId') missionId: string, @Request() req: any) {
    return this.quizService.getQuestions(parseInt(missionId, 10), req.user.id);
  }

  @Get(':missionId/status')
  async getStatus(@Param('missionId') missionId: string, @Request() req: any) {
    return this.quizService.getQuizStatus(parseInt(missionId, 10), req.user.id);
  }

  @Post(':missionId/submit')
  async submitQuiz(
    @Param('missionId') missionId: string,
    @Body() submitDto: SubmitQuizDto,
    @Request() req: any,
  ) {
    return this.quizService.submitQuiz(
      parseInt(missionId, 10),
      req.user.id,
      submitDto.answers,
    );
  }

  @Get(':missionId/attempts')
  async getAttempts(@Param('missionId') missionId: string, @Request() req: any) {
    return this.quizService.getAttempts(parseInt(missionId, 10), req.user.id);
  }
}
