import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanetEntity } from './entities/planet.entity';
import { PlanetNameDto } from './dto/planet-name.dto';

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(PlanetEntity)
    private readonly planetRepo: Repository<PlanetEntity>,
  ) {}

  findAll({ page, perPage }: PaginationDto) {
    const skip = (page - 1) * perPage;
    return this.planetRepo.find({
      skip,
      take: perPage,
      order: { name: 'ASC' },
    });
  }

  findOne({ name }: PlanetNameDto) {
    return this.planetRepo.findOne({ where: { name } });
  }
}
