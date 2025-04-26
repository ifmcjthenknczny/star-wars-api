import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Episode } from './entities/episode.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EpisodeCodenameDto } from './dto/episode-codename.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodesRepo: Repository<Episode>,
  ) {}

  create(createEpisodeDto: CreateEpisodeDto) {
    return this.episodesRepo.save(createEpisodeDto);
  }

  findAll({ page, perPage }: PaginationDto) {
    const skip = (page - 1) * perPage;
    return this.episodesRepo.find({
      skip,
      take: perPage,
      order: { episode_number: 'ASC', codename: 'ASC' },
    });
  }

  findOne({ codename }: EpisodeCodenameDto) {
    return this.episodesRepo.findOne({ where: { codename } });
  }

  update({ codename }: EpisodeCodenameDto, updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodesRepo.update(codename, updateEpisodeDto);
  }

  remove({ codename }: EpisodeCodenameDto) {
    return this.episodesRepo.delete(codename);
  }
}
