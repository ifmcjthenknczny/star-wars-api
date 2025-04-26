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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Protected } from 'src/common/decorators/protected/protected.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Protected()
  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.charactersService.findAll(query);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    console.log(name);
    return this.charactersService.findOne(name);
  }

  @Protected()
  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update({ name }, updateCharacterDto);
  }

  @Protected()
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.charactersService.remove({ name });
  }
}
