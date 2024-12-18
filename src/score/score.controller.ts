import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScoreService } from './score.service';
import { Score } from './score.entity';
import { UpdateScoreDto } from './dto/update-score.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('score')
@UseGuards(AuthGuard())
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get(':userId')
  getUserScore(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<Score> {
    return this.scoreService.getUserScore(userId, user);
  }

  @Patch(':userId/score')
  updateScore(
    @Param('userId') userId: string,
    @Body() scoreData: UpdateScoreDto,
    @GetUser() user: User,
  ): Promise<Score> {
    return this.scoreService.updateScore(userId, scoreData, user);
  }
}
