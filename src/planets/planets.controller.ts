import { Controller, Get, Param } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  findAll(pagination: PaginationDto) {
    return this.planetsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('name') name: string) {
    return this.planetsService.findOne({ name });
  }
}
