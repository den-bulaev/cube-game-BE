import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ScoreModule } from './score/score.module';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    ScoreModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          ...(isProduction
            ? { url: process.env.DATABASE_URL }
            : {
                host: configService.get('PGHOST'),
                port: configService.get('PGPORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
              }),

          database: configService.get('POSTGRES_DB'),
          autoLoadEntities: true,
          synchronize: !isProduction,
        };
      },
    }),
  ],
})
export class AppModule {}
