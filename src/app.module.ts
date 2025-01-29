import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ScoreModule } from './score/score.module';
import { configValidationSchema } from './config.schema';

const isProduction = process.env.NODE_ENV === 'prod';
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('PGHOST', process.env.PGHOST);
console.log('PGPORT', process.env.PGPORT);
console.log('POSTGRES_USER', process.env.POSTGRES_USER);
console.log('POSTGRES_PASSWORD', process.env.POSTGRES_PASSWORD);
console.log('POSTGRES_DB', process.env.POSTGRES_DB);
console.log('JWT_SECRET', process.env.JWT_SECRET);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'prod'
          ? []
          : [`.env.stage.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    ScoreModule,
    TypeOrmModule.forRoot({
      ssl: isProduction,
      extra: {
        ssl: isProduction ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: !isProduction,
      url: process.env.DATABASE_URL,
    }),
  ],
})
export class AppModule {}
