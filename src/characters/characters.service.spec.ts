/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { CharactersService } from './characters.service';
import { CharacterEntity } from './entities/character.entity';
import { CharacterEpisodeEntity } from './entities/character-episodes.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CharacterNameDto } from './dto/character-name.dto';
import { mapCharacterEntityToDto } from './character.mapper';

type MockRepository<T extends object = any> = Pick<
  Repository<T>,
  'create' | 'find' | 'findOne' | 'delete'
> & {
  create: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
  delete: jest.Mock;
};

const createMockRepository = <T extends object = any>(): MockRepository<T> => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockEntityManager = Pick<
  EntityManager,
  'insert' | 'findOne' | 'update' | 'delete' | 'save'
> & {
  insert: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  save: jest.Mock;
};

const createMockEntityManager = (): MockEntityManager => ({
  insert: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

type MockDataSource = Pick<DataSource, 'transaction'> & {
  transaction: jest.Mock;
};

const createMockDataSource = (
  entityManager: MockEntityManager,
): MockDataSource => ({
  transaction: jest.fn().mockImplementation(async (callback) => {
    return await callback(entityManager);
  }),
});

interface MockEpisodeEntity {
  codename: string;
  title: string;
}

describe('CharactersService', () => {
  let service: CharactersService;
  let characterRepo: MockRepository<CharacterEntity>;
  let characterEpisodeRepo: MockRepository<CharacterEpisodeEntity>;
  let dataSource: MockDataSource;
  let entityManager: MockEntityManager;

  const mockCharacterEntityCore: Omit<CharacterEntity, 'characterEpisodes'> = {
    name: 'Luke Skywalker',
    planet: 'Tatooine',
  };

  const mockCharacterEntity: CharacterEntity = {
    ...mockCharacterEntityCore,
    characterEpisodes: [
      {
        character_name: 'Luke Skywalker',
        episode: 'NEWHOPE',
        character: mockCharacterEntityCore as CharacterEntity,
        episodeEntity: {
          codename: 'NEWHOPE',
          title: 'A New Hope',
        } as MockEpisodeEntity,
      },
      {
        character_name: 'Luke Skywalker',
        episode: 'EMPIRE',
        character: mockCharacterEntityCore as CharacterEntity,
        episodeEntity: {
          codename: 'EMPIRE',
          title: 'The Empire Strikes Back',
        } as MockEpisodeEntity,
      },
      {
        character_name: 'Luke Skywalker',
        episode: 'JEDI',
        character: mockCharacterEntityCore as CharacterEntity,
        episodeEntity: {
          codename: 'JEDI',
          title: 'Return of the Jedi',
        } as MockEpisodeEntity,
      },
    ],
  };

  const mockCharacterDto = mapCharacterEntityToDto(mockCharacterEntity);

  const mockCharacterEntity2: CharacterEntity = {
    name: 'Darth Vader',
    planet: 'Death Star',
    characterEpisodes: [],
  };
  const mockCharacterDto2 = mapCharacterEntityToDto(mockCharacterEntity2);

  beforeEach(async () => {
    entityManager = createMockEntityManager();
    dataSource = createMockDataSource(entityManager);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        { provide: DataSource, useValue: dataSource },
        {
          provide: getRepositoryToken(CharacterEntity),
          useValue: createMockRepository<CharacterEntity>(),
        },
        {
          provide: getRepositoryToken(CharacterEpisodeEntity),
          useValue: createMockRepository<CharacterEpisodeEntity>(),
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    characterRepo = module.get<MockRepository<CharacterEntity>>(
      getRepositoryToken(CharacterEntity),
    );
    characterEpisodeRepo = module.get<MockRepository<CharacterEpisodeEntity>>(
      getRepositoryToken(CharacterEpisodeEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a character and its episodes within a transaction', async () => {
      const createDto: CreateCharacterDto = {
        name: 'Han Solo',
        planet: 'Corellia',
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      };
      const mockCreatedCharacter = {
        name: createDto.name,
        planet: createDto.planet,
      };
      const mockCreatedEpisodes = createDto.episodes.map((ep) => ({
        character_name: createDto.name,
        episode: ep,
      }));

      characterRepo.create.mockReturnValue(
        mockCreatedCharacter as CharacterEntity,
      );
      characterEpisodeRepo.create.mockReturnValue(
        mockCreatedEpisodes as CharacterEpisodeEntity[],
      );
      entityManager.insert.mockResolvedValue({});

      const result = await service.create(createDto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(characterRepo.create).toHaveBeenCalledWith({
        name: createDto.name,
        planet: createDto.planet,
      });
      expect(characterEpisodeRepo.create).toHaveBeenCalledWith(
        createDto.episodes.map((episode) => ({
          character_name: createDto.name,
          episode,
        })),
      );
      expect(entityManager.insert).toHaveBeenCalledTimes(2);
      expect(entityManager.insert).toHaveBeenCalledWith(
        CharacterEntity,
        mockCreatedCharacter,
      );
      expect(entityManager.insert).toHaveBeenCalledWith(
        CharacterEpisodeEntity,
        mockCreatedEpisodes,
      );
      expect(result).toEqual({
        message: `Character ${createDto.name} created successfully`,
      });
    });

    it('should throw error if transaction fails', async () => {
      const createDto: CreateCharacterDto = {
        name: 'Failed Character',
        episodes: ['NEWHOPE'],
      };
      const error = new Error('DB insert failed');
      const mockCreatedCharacter = { name: createDto.name };
      const mockCreatedEpisodes = [
        { character_name: createDto.name, episode: 'NEWHOPE' },
      ];

      characterRepo.create.mockReturnValue(mockCreatedCharacter);
      characterEpisodeRepo.create.mockReturnValue(mockCreatedEpisodes);
      entityManager.insert.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of characters with pagination', async () => {
      const paginationDto: PaginationDto = { page: 1, perPage: 10 };
      const mockCharacters = [mockCharacterEntity, mockCharacterEntity2];
      characterRepo.find.mockResolvedValue(mockCharacters);

      const result = await service.findAll(paginationDto);

      expect(characterRepo.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { name: 'ASC' },
        relations: { characterEpisodes: true },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockCharacterDto);
      expect(result[1]).toEqual(mockCharacterDto2);
    });

    it('should calculate skip correctly for other pages', async () => {
      const paginationDto: PaginationDto = { page: 3, perPage: 5 };
      characterRepo.find.mockResolvedValue([]);

      await service.findAll(paginationDto);

      expect(characterRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
    });

    it('should return an empty array if no characters found', async () => {
      const paginationDto: PaginationDto = { page: 1, perPage: 10 };
      characterRepo.find.mockResolvedValue([]);

      const result = await service.findAll(paginationDto);

      expect(characterRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single character DTO if found', async () => {
      const name = mockCharacterEntity.name;
      characterRepo.findOne.mockResolvedValue(mockCharacterEntity);

      const result = await service.findOne(name);

      expect(characterRepo.findOne).toHaveBeenCalledWith({
        where: { name },
        relations: { characterEpisodes: true },
      });
      expect(result).toEqual(mockCharacterDto);
    });

    it('should throw NotFoundException if character not found', async () => {
      const name = 'NonExistentCharacter';
      characterRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(name)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(name)).rejects.toThrow(
        `Character ${name} not found`,
      );
      expect(characterRepo.findOne).toHaveBeenCalledWith({
        where: { name },
        relations: { characterEpisodes: true },
      });
    });
  });

  describe('update', () => {
    const nameDto: CharacterNameDto = { name: 'Luke Skywalker' };
    const updateDto: UpdateCharacterDto = {
      name: 'Luke S.',
      planet: 'Dagobah',
      episodes: ['EMPIRE'],
    };

    it('should successfully update a character (name, planet, episodes) within a transaction', async () => {
      const existingCharacter = JSON.parse(JSON.stringify(mockCharacterEntity));
      entityManager.findOne.mockResolvedValue(existingCharacter);
      entityManager.update.mockResolvedValue({ affected: 1 });
      entityManager.delete.mockResolvedValue({ affected: 3 });
      entityManager.save.mockResolvedValue({});

      const result = await service.update(nameDto, updateDto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(CharacterEntity, {
        where: { name: nameDto.name },
        relations: { characterEpisodes: true },
      });
      expect(entityManager.update).toHaveBeenCalledWith(
        CharacterEntity,
        { name: nameDto.name },
        { name: updateDto.name, planet: updateDto.planet },
      );
      expect(entityManager.delete).toHaveBeenCalledWith(
        CharacterEpisodeEntity,
        { character: { name: nameDto.name } },
      );
      expect(entityManager.save).toHaveBeenCalledWith(
        CharacterEpisodeEntity,
        expect.arrayContaining([
          expect.objectContaining({
            episode: 'EMPIRE',
            character: existingCharacter,
          }),
        ]),
      );
      expect(entityManager.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: `Character '${nameDto.name}' updated successfully`,
      });
    });

    it('should update only name and planet if episodes are undefined', async () => {
      const updatePartialDto: UpdateCharacterDto = {
        name: 'Luke S.',
        planet: 'Dagobah',
      };
      const existingCharacter = JSON.parse(JSON.stringify(mockCharacterEntity));
      entityManager.findOne.mockResolvedValue(existingCharacter);
      entityManager.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(nameDto, updatePartialDto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(CharacterEntity, {
        where: { name: nameDto.name },
        relations: {},
      });
      expect(entityManager.update).toHaveBeenCalledWith(
        CharacterEntity,
        { name: nameDto.name },
        { name: updatePartialDto.name, planet: updatePartialDto.planet },
      );
      expect(entityManager.delete).not.toHaveBeenCalled();
      expect(entityManager.save).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: `Character '${nameDto.name}' updated successfully`,
      });
    });

    it('should update only episodes if name/planet are undefined', async () => {
      const updateEpisodesDto: UpdateCharacterDto = {
        episodes: ['NEWHOPE', 'JEDI'],
      };
      const existingCharacter = JSON.parse(JSON.stringify(mockCharacterEntity));
      entityManager.findOne.mockResolvedValue(existingCharacter);
      entityManager.update.mockResolvedValue({ affected: 1 });
      entityManager.delete.mockResolvedValue({ affected: 3 });
      entityManager.save.mockResolvedValue({});

      const result = await service.update(nameDto, updateEpisodesDto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledWith(CharacterEntity, {
        where: { name: nameDto.name },
        relations: { characterEpisodes: true },
      });
      expect(entityManager.update).toHaveBeenCalledWith(
        CharacterEntity,
        { name: nameDto.name },
        { name: undefined, planet: undefined },
      );
      expect(entityManager.delete).toHaveBeenCalledWith(
        CharacterEpisodeEntity,
        { character: { name: nameDto.name } },
      );
      expect(entityManager.save).toHaveBeenCalledWith(
        CharacterEpisodeEntity,
        expect.arrayContaining([
          expect.objectContaining({
            episode: 'NEWHOPE',
            character: existingCharacter,
          }),
          expect.objectContaining({
            episode: 'JEDI',
            character: existingCharacter,
          }),
        ]),
      );
      expect(result).toEqual({
        message: `Character '${nameDto.name}' updated successfully`,
      });
    });

    it('should throw NotFoundException if character to update is not found', async () => {
      entityManager.findOne.mockResolvedValue(null);

      await expect(service.update(nameDto, updateDto)).rejects.toThrow(
        new NotFoundException(
          `Character with name "${nameDto.name}" not found.`,
        ),
      );
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalledTimes(1);
      expect(entityManager.update).not.toHaveBeenCalled();
      expect(entityManager.delete).not.toHaveBeenCalled();
      expect(entityManager.save).not.toHaveBeenCalled();
    });

    it('should throw error if transaction fails during update', async () => {
      const existingCharacter = JSON.parse(JSON.stringify(mockCharacterEntity));
      const error = new Error('DB update failed');
      entityManager.findOne.mockResolvedValue(existingCharacter);
      entityManager.update.mockRejectedValue(error);

      await expect(service.update(nameDto, updateDto)).rejects.toThrow(error);
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(entityManager.findOne).toHaveBeenCalled();
      expect(entityManager.update).toHaveBeenCalled();
      expect(entityManager.delete).not.toHaveBeenCalled();
      expect(entityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const nameDto: CharacterNameDto = { name: 'Jar Jar Binks' };

    it('should successfully remove a character', async () => {
      characterRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(nameDto);

      expect(characterRepo.delete).toHaveBeenCalledWith({ name: nameDto.name });
      expect(result).toEqual({
        message: `Character ${nameDto.name} deleted successfully`,
      });
    });

    it('should throw NotFoundException if character to remove is not found', async () => {
      characterRepo.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(nameDto)).rejects.toThrow(NotFoundException);
      await expect(service.remove(nameDto)).rejects.toThrow(
        `Character ${nameDto.name} not found`,
      );
      expect(characterRepo.delete).toHaveBeenCalledWith({ name: nameDto.name });
    });
  });
});
