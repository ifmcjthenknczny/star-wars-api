import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';

@Module({
  providers: [PlanetsService],
})
export class PlanetsModule {}
