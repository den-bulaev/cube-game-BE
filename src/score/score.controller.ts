import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScoreService } from './score.service';
import { Score } from './score.entity';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('score')
@UseGuards(AuthGuard())
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get(':userId')
  getUserScore(@Param('userId') userId: string): Promise<Score> {
    return this.scoreService.getUserScore(userId);
  }

  @Patch(':userId/score')
  updateScore(
    @Param('userId') userId: string,
    @Body() scoreData: UpdateScoreDto,
  ): Promise<Score> {
    return this.scoreService.updateScore(userId, scoreData);
  }
}
