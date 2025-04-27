import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { DEFAULT_VALUES, PaginationDto } from 'src/common/dto/pagination.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { Paginated } from 'src/common/decorators/paginated/paginated.decorator';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  @Paginated()
  @ApiResponse({
    status: 200,
    description: 'Successful response with paginated list of planets',
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
                  name: { type: 'string', example: 'Earth' },
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
    const result = await this.planetsService.findAll(pagination);
    return { result, ...pagination };
  }

  @Protected()
  @Delete(':name')
  @ApiResponse({
    status: 200,
    description: 'Planet successfully deleted',
    example: { message: 'Planet Earth deleted successfully' },
  })
  @ApiResponse({
    status: 404,
    description: 'Planet not found',
    example: { message: 'Planet Earth not found' },
  })
  async remove(@Param('name') name: string) {
    return this.planetsService.remove({ name });
  }

  @Protected()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Planet successfully created',
    example: { message: 'Planet Earth created successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation or foreign key error',
    example: { message: 'Planet Earth not found' },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, possibly a duplicate key error',
    example: {
      message:
        'Row with "name" of value "Earth" already exists in the table "planets".',
    },
  })
  @Post()
  async create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetsService.create(createPlanetDto);
  }
}
