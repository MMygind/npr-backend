import { WashTypeService } from './washtype.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { LocationService } from '../location/location.service';

describe('WashTypeService', () => {
  let washTypeService: WashTypeService;
  const mockLocationService = {};
  const mockWashTypeRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((washType) => washType),
  };
  // const mockLocationRepository = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WashTypeService,
        {
          provide: getRepositoryToken(WashTypeEntity),
          useValue: mockWashTypeRepository,
        },
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
        /*{
          provide: getRepositoryToken(LocationEntity),
          useValue: mockLocationRepository,
        },*/
      ],
    }).compile();

    washTypeService = module.get<WashTypeService>(WashTypeService);
  });

  it('should be defined', () => {
    expect(washTypeService).toBeDefined();
  });
});
