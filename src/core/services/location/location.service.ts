import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../../../infrastructure/entities/location.entity';
import { Repository } from 'typeorm';
import { LocationModel } from '../../models/location.model';
import { CreateLocationDto } from '../../../api/_web/dtos/create-location.dto';
import { CompanyService } from '../company/company.service';
import { UpdateLocationDto } from '../../../api/_web/dtos/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
    private companyService: CompanyService,
  ) {}

  async getAllLocations(): Promise<LocationModel[]> {
    const locations = await this.locationRepository.find({
      relations: ['company', 'washTypes'],
      order: { name: 'ASC' },
    });
    if (locations == undefined || locations.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    locations.forEach((location) => this.sortLocationWashTypes(location));
    return locations;
  }

  async getCompanyLocations(companyID: number): Promise<LocationModel[]> {
    const locations = await this.locationRepository.find({
      where: { company: { id: companyID } },
      order: { name: 'ASC' },
    });
    if (locations == undefined || locations.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    return locations;
  }

  async getLocation(
    locationID: number,
    companyID: number,
  ): Promise<LocationModel> {
    if (locationID <= 0) {
      throw new BadRequestException('Location ID must be a positive integer');
    }
    const location = await this.locationRepository.findOne(locationID, {
      relations: ['company', 'washTypes'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${locationID} not found`);
    }
    if (location.company.id !== companyID) {
      throw new ForbiddenException(
        `Not allowed to access location with ID ${locationID}`,
      );
    }
    this.sortLocationWashTypes(location);
    return location;
  }

  async createLocation(
    dto: CreateLocationDto,
    companyID: number,
  ): Promise<LocationModel> {
    if (dto.company.id !== companyID) {
      throw new ForbiddenException(
        `Not allowed to access company with ID ${dto.company.id}`,
      );
    }
    dto.company = await this.companyService.getCompany(dto.company.id);
    const newLocation = this.locationRepository.create(dto);
    await this.locationRepository.save(newLocation);
    return await this.getLocation(newLocation.id, companyID);
  }

  async updateLocation(
    locationID: number,
    dto: UpdateLocationDto,
    companyID: number,
  ): Promise<LocationModel> {
    if (locationID != dto.id) {
      throw new BadRequestException('Location ID does not match parameter ID');
    }
    await this.getLocation(dto.id, companyID); // will throw exception if it does not exist already, id is negative or forbidden
    await this.locationRepository.save(dto);
    return await this.getLocation(locationID, companyID);
  }

  // note that already soft-deleted entries can be soft-deleted again
  async deleteLocation(
    locationID: number,
    companyID: number,
  ): Promise<boolean> {
    if (locationID <= 0) {
      throw new BadRequestException('Location ID must be a positive integer');
    }
    await this.getLocation(locationID, companyID); // will throw exception if it does not exist already, id is negative or forbidden
    const deleteResponse = await this.locationRepository.softDelete(locationID);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Location with ID ${locationID} not found`);
    }
    return true;
  }

  sortLocationWashTypes(location: LocationModel) {
    // maybe replace with querybuilder
    location.washTypes = location.washTypes.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
    );
  }
}
