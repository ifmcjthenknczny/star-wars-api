import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterEntity } from './entities/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CharacterNameDto } from './dto/character-name.dto';
import { mapCharacterEntityToDto } from './character.mapper';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(CharacterEntity)
    private readonly characterRepo: Repository<CharacterEntity>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const character = this.characterRepo.create(createCharacterDto);
    const savedCharacter = await this.characterRepo.save(character);

    return {
      message: `Character ${savedCharacter.name} created successfully`,
    };
  }

  async findAll({ page, perPage }: PaginationDto) {
    const skip = (page - 1) * perPage;
    const characters = await this.characterRepo.find({
      skip,
      take: perPage,
      order: { name: 'ASC' },
      relations: {
        characterEpisodes: true,
      },
    });

    return characters.map(mapCharacterEntityToDto);
  }

  async findOne(name: string) {
    const character = await this.characterRepo.findOne({
      where: { name },
      relations: {
        characterEpisodes: true,
      },
    });
    if (!character) {
      throw new NotFoundException(`Character ${name} not found`);
    }
    return mapCharacterEntityToDto(character);
  }

  async update(
    { name }: CharacterNameDto,
    updateCharacterDto: UpdateCharacterDto,
  ) {
    await this.characterRepo.update(name, updateCharacterDto);
    const updatedCharacter = await this.characterRepo.findOne({
      where: { name },
    });

    if (!updatedCharacter) {
      throw new NotFoundException(`Character with ${name} not found`);
    }

    return { message: `Character of ${name} updated successfully` };
  }

  async remove({ name }: CharacterNameDto) {
    const result = await this.characterRepo.delete({ name });
    if (result.affected === 0) {
      throw new NotFoundException(`Character with ${name} not found`);
    }
    return { message: 'Character deleted successfully' };
  }
}
