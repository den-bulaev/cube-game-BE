import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { Score } from './score.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TopScore } from './topScore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Score, TopScore]), AuthModule],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
