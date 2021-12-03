import { WashTypeService } from './washtype.service';
import { LocationModel } from '../../models/location.model';
import { WashTypeModel } from '../../models/washtype.model';
import { Test } from '@nestjs/testing';
import { LocationService } from '../location/location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { CompanyModel } from '../../models/company.model';
import { CreateWashTypeDto } from '../../../api/dtos/create-washtype.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

// npm run test to run all tests
// npm run -- washtype.service.spec.ts to run this specific test file
describe('WashTypeService', () => {
  // region Variables
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
    // mockReturnValue doesn't work in below method
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
  // endregion

  // region beforeEach
  beforeEach(async () => {
    // region TestingModule
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
    // endregion

    // region Mock data
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
    washTypes.push({
      id: 3,
      name: 'Quick',
      price: 99,
      location: location,
    });
    // endregion
  });

  // endregion

  // region WashType defined test
  it('should be defined', () => {
    expect(washTypeService).toBeDefined();
  });
  // endregion

  // region getAllWashTypes tests
  describe('getAllWashTypes', () => {
    it('should return all wash types', async () => {
      expect(await washTypeService.getAllWashTypes()).toEqual(washTypes);
    });

    it('should throw HttpException if array is empty', async () => {
      washTypes = [];
      await expect(washTypeService.getAllWashTypes()).rejects.toEqual(
        new HttpException('No elements found', HttpStatus.NO_CONTENT),
      );
    });
  });
  // endregion

  // region getWashType tests
  describe('getWashType', () => {
    it.each([
      [1, 0],
      [2, 1],
      [3, 2],
    ])(
      'should return single wash type with ID of %s',
      async (id, arrayIndex) => {
        const expectedWashType = washTypes[arrayIndex];
        const receivedWashType = await washTypeService.getWashType(id);

        expect(receivedWashType.id).toEqual(expectedWashType.id);
        expect(receivedWashType.name).toEqual(expectedWashType.name);
        expect(receivedWashType.price).toEqual(expectedWashType.price);
      },
    );

    it.each([-1, 0])(
      'should throw a BadRequestException if ID searched for is non-positive',
      async (id: number) => {
        await expect(washTypeService.getWashType(id)).rejects.toEqual(
          new BadRequestException('Wash type ID must be a positive integer'),
        );
      },
    );

    it('should throw a NotFoundException if single wash type with matching ID is not found', async () => {
      const highestID = 3;

      await expect(washTypeService.getWashType(highestID + 1)).rejects.toEqual(
        new NotFoundException(`Wash type with ID ${highestID + 1} not found`),
      );
    });
  });
  // endregion
});
