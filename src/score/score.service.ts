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

    found.topScore = topScore;

    return found;
  }

  async updateScore(
    userId: string,
    scoreData: UpdateScoreDto,
    user: User,
  ): Promise<Score> {
    const { score } = scoreData;
    const foundedScore = await this.getUserScore(userId, user);
    const { value: topScoreValue, id: topScoreId } = foundedScore.topScore;
    const preparedTopScore: TopScore = { ...foundedScore.topScore };

    if (score < topScoreValue || topScoreValue === null) {
      preparedTopScore.value = score;
      preparedTopScore.userId = user.id;
      this.topScoreRepository.update(topScoreId, preparedTopScore);
    }

    foundedScore.score =
      foundedScore.score < score && foundedScore.score !== null
        ? foundedScore.score
        : score;

    foundedScore.topScore = preparedTopScore;

    await this.scoresRepository.update(foundedScore.id, foundedScore);

    return foundedScore;
  }
}
