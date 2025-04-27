import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { DEFAULT_VALUES, PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Paginated } from 'src/common/decorators/paginated/paginated.decorator';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Protected()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Episode successfully created',
    example: { message: 'Episode DESTRUCTION created successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation or foreign key error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, possibly a duplicate key error',
    example: {
      message:
        'Row with "codename" of value "DESTRUCTION" already exists in the table "episodes".',
    },
  })
  async create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  @Get()
  @Paginated()
  @ApiResponse({
    status: 200,
    description: 'Successful response with paginated list of episodes',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            result: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  codename: { type: 'string', example: 'DESTRUCTION' },
                  title: {
                    type: 'string',
                    example: 'Destruction of Planet Earth',
                  },
                  episode_number: { type: 'number', example: 42 },
                },
              },
            },
            perPage: {
              type: 'number',
              example: 10,
              default: DEFAULT_VALUES.perPage,
            },
            page: { type: 'number', example: 1, default: DEFAULT_VALUES.page },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation error',
  })
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.episodesService.findAll(pagination);
    return { result, ...pagination };
  }

  @Protected()
  @Patch(':codename')
  @ApiResponse({
    status: 200,
    description: 'Episode successfully updated',
    example: { message: 'Episode DESTRUCTION updated successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation or foreign key error',
  })
  @ApiResponse({
    status: 404,
    description: 'Episode not found',
    example: { message: 'Episode DESTRUCTION not found' },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, possibly a duplicate key error',
    example: {
      message:
        'Row with "codename" of value "DESTRUCTION" already exists in the table "episodes".',
    },
  })
  async update(
    @Param('codename') codename: string,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update({ codename }, updateEpisodeDto);
  }

  @Protected()
  @Delete(':codename')
  @ApiResponse({
    status: 200,
    description: 'Episode successfully deleted',
    example: { message: 'Episode DESTRUCTION deleted successfully' },
  })
  @ApiResponse({
    status: 404,
    description: 'Episode DESTRUCTION not found',
  })
  async remove(@Param('codename') codename: string) {
    return this.episodesService.remove({ codename });
  }
}
