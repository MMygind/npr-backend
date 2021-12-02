import { WashTypeService } from './washtype.service';
import { LocationModel } from '../../models/location.model';
import { WashTypeModel } from '../../models/washtype.model';
import { Test } from '@nestjs/testing';
import { LocationService } from '../location/location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { CompanyModel } from '../../models/company.model';
import { CreateWashTypeDto } from '../../../api/dtos/create-washtype.dto';

describe('WashTypeService', () => {
  let washTypeService: WashTypeService;
  let company: CompanyModel;
  let location: LocationModel;
  let locations: LocationModel[] = [];
  let washTypes: WashTypeModel[] = [];
  const mockLocationService = {
    getLocation: jest
      .fn()
      .mockImplementation((id: number) =>
        locations.find((location) => location.id == id),
      ),
  };
  const mockWashTypeRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve(washTypes)),
    findOne: jest
      .fn()
      .mockImplementation((id: number) =>
        Promise.resolve(washTypes.find((washType) => washType.id == id)),
      ),
    create: jest.fn().mockImplementation((dto: CreateWashTypeDto) => ({
      id: washTypes.length + 1,
      ...dto,
    })),
    save: jest.fn().mockImplementation((model: WashTypeModel) => {
      washTypes.push(model);
      return model;
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WashTypeService,
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
        {
          provide: getRepositoryToken(WashTypeEntity),
          useValue: mockWashTypeRepository,
        },
      ],
    }).compile();

    washTypeService = await module.get<WashTypeService>(WashTypeService);
    locations = [];
    washTypes = [];
    company = {
      id: 1,
      name: 'Mock Company',
      locations: [],
      creationDate: new Date('2020-12-31T00:00:00'),
      email: 'mock@mock.com',
      phoneNumber: '12345678',
    };
    location = {
      id: 1,
      name: 'Mock Location',
      address: 'Mock Street',
      company: company,
      washTypes: [],
      postalCode: 1000,
      city: 'Mock City',
      longitude: 0,
      latitude: 0,
    };
    locations.push(location);
  });

  it('should be defined', () => {
    expect(washTypeService).toBeDefined();
  });

  describe('getAllWashTypes', () => {
    beforeEach(() => {
      washTypes.push({
        id: 1,
        name: 'Premium',
        price: 159,
        location: location,
      });
      washTypes.push({
        id: 2,
        name: 'Standard',
        price: 129,
        location: location,
      });
    });

    it('should return all wash types', async () => {
      expect(await washTypeService.getAllWashTypes()).toEqual(washTypes);

      expect(mockWashTypeRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return a single specified wash type', async () => {
      const receivedWashType = await washTypeService.getWashType(2);

      expect(receivedWashType.id).toEqual(2);
      expect(receivedWashType.name).toEqual('Standard');
      expect(receivedWashType.price).toEqual(129);

      expect(mockWashTypeRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockWashTypeRepository.findOne).toHaveBeenCalledWith(2);
    });
  });
});
