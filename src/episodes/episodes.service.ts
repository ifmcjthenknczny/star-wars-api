import { Injectable, NotFoundException } from '@nestjs/common';
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
    const episode = this.episodesRepo.create(createEpisodeDto);
    const savedEpisode = await this.episodesRepo.save(episode);

    return {
      message: `Episode ${savedEpisode.codename} created successfully`,
    };
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
    const result = await this.episodesRepo.update(codename, updateEpisodeDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Episode '${codename}' not found`);
    }
    return { message: `Episode '${codename}' updated successfully` };
  }

  async remove({ codename }: EpisodeCodenameDto) {
    const result = await this.episodesRepo.delete(codename);
    if (result.affected === 0) {
      throw new NotFoundException(`Episode '${codename}' not found`);
    }
    return { message: `Episode '${codename}' deleted successfully` };
  }
}
