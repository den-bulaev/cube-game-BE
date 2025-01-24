import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Score } from './score.entity';
import { UpdateScoreDto } from './dto/update-score.dto';
import { User } from 'src/auth/user.entity';
import { TopScore } from './topScore.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoresRepository: Repository<Score>,

    @InjectRepository(TopScore)
    private topScoreRepository: Repository<TopScore>,
  ) {}

  async getUserScore(userId: string, user: User): Promise<Score> {
    const found = await this.scoresRepository.findOneBy({ userId, user });
    const topScore: TopScore = await this.topScoreRepository.findOneBy({
      id: 1,
    });

    if (!found || !topScore) {
      throw new NotFoundException('Score not found');
    }

    const { score } = found;

    if (topScore && topScore.value < score) {
      const preparedTopScore: TopScore = {
        ...topScore,
        value: score,
        userId: user.id,
      };

      this.topScoreRepository.save(preparedTopScore);

      found.topScore = preparedTopScore;
    } else {
      found.topScore = topScore;
    }

    await this.scoresRepository.update(found.id, found);

    return found;
  }

  async updateScore(
    userId: string,
    scoreData: UpdateScoreDto,
    user: User,
  ): Promise<Score> {
    const { score } = scoreData;
    const foundedScore = await this.getUserScore(userId, user);

    delete foundedScore.topScore;

    foundedScore.score =
      foundedScore.score < score ? score : foundedScore.score;

    await this.scoresRepository.save(foundedScore);

    return foundedScore;
  }
}
