import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { EpisodeEntity } from './entities/episode.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EpisodeCodenameDto } from './dto/episode-codename.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodesRepo: Repository<EpisodeEntity>,
  ) {}

  async create(createEpisodeDto: CreateEpisodeDto) {
    return this.episodesRepo.save(createEpisodeDto);
  }

  async findAll({ page, perPage }: PaginationDto) {
    const skip = (page - 1) * perPage;
    return this.episodesRepo.find({
      skip,
      take: perPage,
      order: { episode_number: 'ASC', codename: 'ASC' },
    });
  }

  async update(
    { codename }: EpisodeCodenameDto,
    updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesRepo.update(codename, updateEpisodeDto);
  }

  async remove({ codename }: EpisodeCodenameDto) {
    return this.episodesRepo.delete(codename);
  }
}
