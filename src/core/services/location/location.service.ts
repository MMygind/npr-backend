import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../../../infrastructure/entities/location.entity';
import { Repository } from 'typeorm';
import { LocationModel } from '../../models/location.model';
import { CreateLocationDto } from '../../../api/dtos/create-location.dto';
import { CompanyService } from '../company/company.service';
import { WashTypeService } from '../washtype/washtype.service';
import { UpdateLocationDto } from '../../../api/dtos/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
    private companyService: CompanyService,
    private washTypeService: WashTypeService,
  ) {}

  async getAllLocations(): Promise<LocationModel[]> {
    const locations = await this.locationRepository.find({
      relations: ['company', 'washTypes'],
    });
    if (locations.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    return locations;
  }

  async getLocation(id: number): Promise<LocationModel> {
    if (id <= 0) {
      throw new BadRequestException('Location ID must be a positive integer');
    }
    const location = await this.locationRepository.findOne(id, {
      relations: ['company', 'washTypes'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async createLocation(dto: CreateLocationDto): Promise<LocationModel> {
    dto.company = await this.companyService.getCompany(dto.company.id);
    const newLocation = this.locationRepository.create(dto);
    await this.locationRepository.save(newLocation);
    return await this.getLocation(newLocation.id);
  }

  async updateLocation(
    id: number,
    dto: UpdateLocationDto,
  ): Promise<LocationModel> {
    if (id != dto.id) {
      throw new BadRequestException('Location ID does not match parameter ID');
    }
    await this.getLocation(dto.id); // will throw exception if it does not exist already, or id is negative
    dto.company = await this.companyService.getCompany(dto.company.id); // will throw exception if it does not exist already, or id is negative
    await Promise.all(
      dto.washTypes.map(async (washType) => {
        const foundWashType = await this.washTypeService.getWashType(
          washType.id,
        );
        if (foundWashType.company.id != dto.company.id) {
          throw new BadRequestException(
            'Can only include valid company wash types',
          );
        }
      }),
    );
    await this.locationRepository.save(dto);
    return await this.getLocation(id);
  }

  // will NOT delete many-many relations with wash types
  // note that already soft-deleted entries can be soft-deleted again
  async deleteLocation(id: number) {
    if (id <= 0) {
      throw new BadRequestException('Location ID must be a positive integer');
    }
    const deleteResponse = await this.locationRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
