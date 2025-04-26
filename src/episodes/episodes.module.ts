import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';
@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
