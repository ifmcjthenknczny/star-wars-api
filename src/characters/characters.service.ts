import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterEntity } from './entities/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CharacterNameDto } from './dto/character-name.dto';
import { mapCharacterEntityToDto } from './character.mapper';
import { CharacterEpisode } from './entities/character-episodes.entity';

@Injectable()
export class CharactersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(CharacterEntity)
    private readonly characterRepo: Repository<CharacterEntity>,

    @InjectRepository(CharacterEpisode)
    private readonly characterEpisodeRepo: Repository<CharacterEpisode>,
  ) {}

  async create({ episodes, ...characterRest }: CreateCharacterDto) {
    return this.dataSource.transaction(async (entityManager: EntityManager) => {
      const character = this.characterRepo.create(characterRest);
      const characterEpisode = this.characterEpisodeRepo.create(
        episodes.map((episode) => ({
          character_name: character.name,
          episode,
        })),
      );
      character.characterEpisodes = characterEpisode;

      const savedCharacter = await entityManager.save(CharacterEntity, character);

      return {
        message: `Character ${savedCharacter.name} created successfully`,
      };
    });
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
    const result = await this.characterRepo.update(
      { name },
      updateCharacterDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Character '${name}' not found`);
    }

    return { message: `Character '${name}' updated successfully` };
  }

  async remove({ name }: CharacterNameDto) {
    const result = await this.characterRepo.delete({ name });
    if (result.affected === 0) {
      throw new NotFoundException(`Character ${name} not found`);
    }
    return { message: `Character ${name} deleted successfully` };
  }
}
