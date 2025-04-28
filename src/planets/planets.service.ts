import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll({ page, perPage }: PaginationDto) {
    const skip = (page - 1) * perPage;
    return this.planetRepo.find({
      skip,
      take: perPage,
      order: { name: 'ASC' },
    });
  }

  async remove({ name }: PlanetNameDto) {
    const result = await this.planetRepo.delete({ name });
    if (result.affected === 0) {
      throw new NotFoundException(`Planet ${name} not found`);
    }
    return { message: `Planet ${name} deleted successfully` };
  }

  async create({ name }: PlanetNameDto) {
    const planet = this.planetRepo.create({ name });
    await this.planetRepo.insert(planet);

    return {
      message: `Planet ${name} created successfully`,
    };
  }
}
