import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Score } from './score.entity';
import { UpdateScoreDto } from './dto/update-score.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async getUserScore(userId: string, user: User): Promise<Score> {
    const found = await this.scoresRepository.findOneBy({ userId, user });

    if (!found) {
      throw new NotFoundException('Score not found');
    }

    return found;
  }

  async updateScore(
    userId: string,
    scoreData: UpdateScoreDto,
    user: User,
  ): Promise<Score> {
    const { score } = scoreData;
    const foundedScore = await this.getUserScore(userId, user);

    foundedScore.score = score;
    await this.scoresRepository.save(foundedScore);

    return foundedScore;
  }
}
