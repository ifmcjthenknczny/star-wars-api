import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanetEntity } from './entities/planet.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PlanetEntity])],
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}
