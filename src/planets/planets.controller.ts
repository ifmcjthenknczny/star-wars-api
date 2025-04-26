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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CreatePlanetDto } from './dto/create-planet.dto';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successful response with a list of planets',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'Earth',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation error',
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.planetsService.findAll(pagination);
  }

  @Protected()
  @Delete(':name')
  @ApiResponse({
    status: 200,
    description: 'Planet successfully deleted',
    example: { message: 'Planet Earth deleted successfully' },
  })
  @ApiResponse({ status: 404, description: 'Planet not found' })
  remove(@Param('name') name: string) {
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
    description: 'Bad request, possibly a validation error',
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
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetsService.create(createPlanetDto);
  }
}
