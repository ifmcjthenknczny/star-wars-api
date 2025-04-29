/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PaginationDto, DEFAULT_VALUES } from 'src/common/dto/pagination.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

const mockCharacter = {
  name: 'James Lovelock',
  planet: 'Earth',
  episodes: ['PHANTOM'],
};

const mockCharacterList = [
  { ...mockCharacter },
  { name: 'Other Character', planet: 'Mars', episodes: ['HOPE'] },
];

const mockCharactersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: CharactersService;

  const mockApiKeyGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockThrottlerGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: mockCharactersService,
        },
      ],
    });

    moduleBuilder.overrideGuard(ApiKeyGuard).useValue(mockApiKeyGuard);
    moduleBuilder.overrideGuard(ThrottlerGuard).useValue(mockThrottlerGuard);

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);

    jest.clearAllMocks();
    mockApiKeyGuard.canActivate.mockClear();
    mockThrottlerGuard.canActivate.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call charactersService.create and return the result', async () => {
      const createDto: CreateCharacterDto = { ...mockCharacter };
      const expectedResult = {
        message: `Character ${createDto.name} created successfully`,
      };
      mockCharactersService.create.mockResolvedValue(expectedResult);
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from the service', async () => {
      const createDto: CreateCharacterDto = { name: 'Duplicate', episodes: [] };
      const expectedError = new Error('Duplicate key error');
      mockCharactersService.create.mockRejectedValue(expectedError);
      await expect(controller.create(createDto)).rejects.toThrow(expectedError);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call charactersService.findAll with pagination and return formatted result', async () => {
      const paginationDto: PaginationDto = {
        page: 2,
        perPage: 5,
      };
      const serviceResult = [...mockCharacterList];
      const expectedResult = {
        result: serviceResult,
        page: paginationDto.page,
        perPage: paginationDto.perPage,
      };
      mockCharactersService.findAll.mockResolvedValue(serviceResult);
      const result = await controller.findAll(paginationDto);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(expectedResult);
    });

    it('should call charactersService.findAll with default pagination if none provided', async () => {
      const paginationDto: PaginationDto = {
        page: DEFAULT_VALUES.page,
        perPage: DEFAULT_VALUES.perPage,
      };
      const serviceResult = [...mockCharacterList];
      const expectedResult = {
        result: serviceResult,
        page: DEFAULT_VALUES.page,
        perPage: DEFAULT_VALUES.perPage,
      };
      mockCharactersService.findAll.mockResolvedValue(serviceResult);
      const result = await controller.findAll(paginationDto);
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: DEFAULT_VALUES.page,
          perPage: DEFAULT_VALUES.perPage,
        }),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call charactersService.findOne with the name and return the result', async () => {
      const expectedResult = mockCharacter;
      mockCharactersService.findOne.mockResolvedValue(expectedResult);
      const result = await controller.findOne(mockCharacter.name);
      expect(service.findOne).toHaveBeenCalledWith(mockCharacter.name);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate not found errors from the service', async () => {
      const name = 'NotFound';
      const expectedError = new Error('Character not found');
      mockCharactersService.findOne.mockRejectedValue(expectedError);
      await expect(controller.findOne(name)).rejects.toThrow(expectedError);
      expect(service.findOne).toHaveBeenCalledWith(name);
    });
  });

  describe('update', () => {
    it('should call charactersService.update with name and DTO, and return the result', async () => {
      const updateDto: UpdateCharacterDto = {
        planet: 'Mars',
      };
      const expectedResult = {
        message: `Character ${mockCharacter.name} updated successfully`,
      };
      mockCharactersService.update.mockResolvedValue(expectedResult);
      const result = await controller.update(mockCharacter.name, updateDto);
      expect(service.update).toHaveBeenCalledWith(
        { name: mockCharacter.name },
        updateDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from the update service', async () => {
      const name = 'NonExistent';
      const updateDto: UpdateCharacterDto = { planet: 'Venus' };
      const expectedError = new Error('Character not found during update');
      mockCharactersService.update.mockRejectedValue(expectedError);
      await expect(controller.update(name, updateDto)).rejects.toThrow(
        expectedError,
      );
      expect(service.update).toHaveBeenCalledWith({ name }, updateDto);
    });
  });

  describe('remove', () => {
    it('should call charactersService.remove with name and return the result', async () => {
      const expectedResult = {
        message: `Character ${mockCharacter.name} deleted successfully`,
      };
      mockCharactersService.remove.mockResolvedValue(expectedResult);
      const result = await controller.remove(mockCharacter.name);
      expect(service.remove).toHaveBeenCalledWith({ name: mockCharacter.name });
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from the remove service', async () => {
      const name = 'NonExistent';
      const expectedError = new Error('Character not found for deletion');
      mockCharactersService.remove.mockRejectedValue(expectedError);
      await expect(controller.remove(name)).rejects.toThrow(expectedError);
      expect(service.remove).toHaveBeenCalledWith({ name });
    });
  });
});
