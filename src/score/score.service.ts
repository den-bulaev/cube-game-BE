import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Score } from './score.entity';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,
  ) {}

  async getUserScore(userId: string): Promise<Score> {
    const found = await this.scoresRepository.findOneBy({ userId });

    if (!found) {
      throw new NotFoundException('Score not found');
    }

    return found;
  }

  async updateScore(userId: string, scoreData: UpdateScoreDto): Promise<Score> {
    const { score } = scoreData;
    const foundedScore = await this.getUserScore(userId);

    foundedScore.score = score;
    await this.scoresRepository.save(foundedScore);

    return foundedScore;
  }
}
