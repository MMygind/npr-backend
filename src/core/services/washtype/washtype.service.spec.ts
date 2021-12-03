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
import { UpdateWashTypeDto } from '../../../api/dtos/update-washtype.dto';
import { UpdateResult } from 'typeorm';

// npm run test to run all tests
// npm run -- washtype.service.spec.ts to run this specific test file
describe('WashTypeService', () => {
  // region Variables
  let washTypeService: WashTypeService;
  let company: CompanyModel;
  let location: LocationModel;
  let locations: LocationModel[];
  let washTypes: WashTypeModel[];
  let find: jest.Mock;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  let softDelete: jest.Mock;
  let getLocation: jest.Mock;
  // endregion

  // region beforeEach
  beforeEach(async () => {
    // region TestingModule
    find = jest.fn().mockImplementation(() => Promise.resolve(washTypes));
    findOne = jest
      .fn()
      .mockImplementation((id: number) =>
        Promise.resolve(washTypes.find((washType) => washType.id == id)),
      );
    create = jest.fn().mockImplementation((dto: CreateWashTypeDto) => dto);
    save = jest.fn().mockImplementation((model: WashTypeModel) => {
      model.id = washTypes.length + 1;
      washTypes.push(model);
      return model;
    });
    softDelete = jest.fn().mockImplementation((id: number) => {
      const foundWashType = washTypes.find((washType) => washType.id == id);
      const result: UpdateResult = { raw: null, generatedMaps: null };
      result.affected = foundWashType ? 1 : 0;
      return result;
    });
    getLocation = jest
      .fn()
      .mockImplementation((id: number) =>
        locations.find((location) => location.id == id),
      );

    const module = await Test.createTestingModule({
      providers: [
        WashTypeService,
        {
          provide: LocationService,
          useValue: {
            getLocation,
          },
        },
        {
          provide: getRepositoryToken(WashTypeEntity),
          useValue: {
            find,
            findOne,
            create,
            save,
            softDelete,
          },
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

      expect(find).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if array is empty', async () => {
      // find.mockReturnValue(Promise.resolve([]));
      washTypes = [];
      await expect(washTypeService.getAllWashTypes()).rejects.toEqual(
        new HttpException('No elements found', HttpStatus.NO_CONTENT),
      );

      expect(find).toHaveBeenCalledTimes(1);
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

        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(id);
      },
    );

    it.each([-1, 0])(
      'should throw a BadRequestException if ID %s searched for is non-positive',
      async (id: number) => {
        await expect(washTypeService.getWashType(id)).rejects.toEqual(
          new BadRequestException('Wash type ID must be a positive integer'),
        );

        expect(findOne).toHaveBeenCalledTimes(0);
      },
    );

    it('should throw a NotFoundException if single wash type with matching ID is not found', async () => {
      const highestID = 3;

      await expect(washTypeService.getWashType(highestID + 1)).rejects.toEqual(
        new NotFoundException(`Wash type with ID ${highestID + 1} not found`),
      );

      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith(highestID + 1);
    });
  });
  // endregion

  // region createWashType tests
  describe('createWashType', () => {
    it('should create and return a new wash type', async () => {
      const highestID = 3;
      const washTypeDto: CreateWashTypeDto = {
        name: 'New wash type',
        price: 100,
        location: location,
      };
      const savedWashType = await washTypeService.createWashType(washTypeDto);

      expect(savedWashType.id).toEqual(highestID + 1);
      expect(savedWashType.name).toEqual(washTypeDto.name);
      expect(savedWashType.price).toEqual(washTypeDto.price);

      expect(create).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledTimes(1);
    });
  });
  // endregion

  // region updateWashType tests
  describe('updateWashType', () => {
    it('should update wash type and then return it', async () => {
      save.mockImplementation((dto) => {
        const index = washTypes.findIndex((washType) => washType.id == dto.id);
        washTypes[index] = dto;
      });

      const idParam = 1;
      const washTypeDto: UpdateWashTypeDto = {
        id: 1,
        name: 'Gold', // old value is 'Premium'
        price: 189, // old value is 159
      };
      const updatedWashType = await washTypeService.updateWashType(
        idParam,
        washTypeDto,
      );

      expect(updatedWashType.id).toEqual(washTypeDto.id);
      expect(updatedWashType.name).toEqual(washTypeDto.name);
      expect(updatedWashType.price).toEqual(washTypeDto.price);

      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith(washTypeDto);
    });

    it('should throw a BadRequestException if parameter ID and wash type ID are different', async () => {
      const idParam = 2;
      const washTypeDto: UpdateWashTypeDto = {
        id: 1,
        name: 'Gold',
        price: 189,
      };

      await expect(
        washTypeService.updateWashType(idParam, washTypeDto),
      ).rejects.toEqual(
        new BadRequestException('Wash type ID does not match parameter ID'),
      );

      expect(save).toHaveBeenCalledTimes(0);
    });
  });
  // endregion

  // region deleteWashType tests
  describe('deleteWashType', () => {
    it.each([1, 2, 3])(
      // these are the IDs of existing wash types in the washtypes array
      'should delete a wash type with ID %s and return true when done',
      async (id) => {
        expect(await washTypeService.deleteWashType(id)).toEqual(true);

        expect(softDelete).toHaveBeenCalledTimes(1);
        expect(softDelete).toHaveBeenCalledWith(id);
      },
    );

    it.each([-1, 0])(
      'should throw a BadRequestException if wash type ID %s is non-positive',
      async (id) => {
        await expect(washTypeService.deleteWashType(id)).rejects.toEqual(
          new BadRequestException('Wash type ID must be a positive integer'),
        );

        expect(softDelete).toHaveBeenCalledTimes(0);
      },
    );

    it('should throw a NotFoundException if no wash type with ID %s is found', async () => {
      const highestID = 3;
      await expect(
        washTypeService.deleteWashType(highestID + 1),
      ).rejects.toEqual(
        new NotFoundException(`Wash type with ID ${highestID + 1} not found`),
      );

      expect(softDelete).toHaveBeenCalledTimes(1);
      expect(softDelete).toHaveBeenCalledWith(highestID + 1);
    });
  });
  // endregion
});
