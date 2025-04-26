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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { DEFAULT_VALUES, PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @Protected()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Character successfully created',
    example: { message: 'Characted James Lovelock created successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, possibly a duplicate key error',
    example: {
      message:
        'Row with "name" of value "James Lovelock" already exists in the table "characters".',
    },
  })
  async create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
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
                  name: { type: 'string', example: 'James Lovelock' },
                  planet: { type: 'string', example: 'Earth' },
                  episodes: {
                    type: 'array',
                    items: { type: 'string', example: 'PHANTOM' },
                  },
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
    const result = await this.charactersService.findAll(pagination);
    return { result, ...pagination };
  }

  @ApiResponse({
    status: 200,
    description: 'Successful response with a single planet',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'James Lovelock' },
            planet: { type: 'string', example: 'Earth' },
            episodes: {
              type: 'array',
              items: { type: 'string', example: 'PHANTOM' },
            },
          },
        },
      },
    },
  })
  async findOne(@Param('name') name: string) {
    return this.charactersService.findOne(name);
  }

  @Protected()
  @Patch(':name')
  @ApiResponse({
    status: 200,
    description: 'Character successfully updated',
    example: { message: 'Character James Lovelock updated successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, possibly a validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Character not found',
    example: { message: 'Character James Lovelock not found' },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, possibly a duplicate key error',
    example: {
      message:
        'Row with "name" of value "James Lovelock" already exists in the table "characters".',
    },
  })
  async update(
    @Param('name') name: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update({ name }, updateCharacterDto);
  }

  @Protected()
  @Delete(':name')
  @ApiResponse({
    status: 200,
    description: 'Character successfully deleted',
    example: { message: 'Character James Lovelock deleted successfully' },
  })
  @ApiResponse({
    status: 404,
    description: 'Character James Lovelock not found',
  })
  async remove(@Param('name') name: string) {
    return this.charactersService.remove({ name });
  }
}
