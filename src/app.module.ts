import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ScoreModule } from './score/score.module';
import { configValidationSchema } from './config.schema';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'prod';
        console.log('NODE_ENV', configService.get('NODE_ENV'));
        console.log('PGHOST', configService.get('PGHOST'));
        console.log('PGPORT', configService.get('PGPORT'));
        console.log('POSTGRES_USER', configService.get('POSTGRES_USER'));
        console.log(
          'POSTGRES_PASSWORD',
          configService.get('POSTGRES_PASSWORD'),
        );
        console.log('POSTGRES_DB', configService.get('POSTGRES_DB'));
        console.log('PGHOST*****', process.env.PGHOST);

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('PGHOST'),
          port: Number(configService.get('PGPORT')),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          autoLoadEntities: true,
          synchronize: !isProduction,
        };
      },
    }),
  ],
})
export class AppModule {}
