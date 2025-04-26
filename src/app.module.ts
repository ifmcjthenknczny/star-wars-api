import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from 'nestjs-pino';
import { EpisodesModule } from './episodes/episodes.module';
import { PlanetsModule } from './planets/planets.module';
@Module({
  imports: [
    CharactersModule,
    ConfigModule,
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
          },
        },
      },
    }),
    EpisodesModule,
    PlanetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
