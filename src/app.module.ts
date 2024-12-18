import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    AuthModule,
    ScoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cube-game',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
