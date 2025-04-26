import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Protected()
  @Post()
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.episodesService.findAll(query);
  }

  @Protected()
  @Patch(':codename')
  update(
    @Param('codename') codename: string,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update({ codename }, updateEpisodeDto);
  }

  @Protected()
  @Delete(':codename')
  remove(@Param('codename') codename: string) {
    return this.episodesService.remove({ codename });
  }
}
