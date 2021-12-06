import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable, InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { Repository } from 'typeorm';
import { WashTypeModel } from '../../models/washtype.model';
import { CreateWashTypeDto } from '../../../api/dtos/create-washtype.dto';
import { UpdateWashTypeDto } from '../../../api/dtos/update-washtype.dto';
import { LocationService } from '../location/location.service';

@Injectable()
export class WashTypeService {
  constructor(
    @InjectRepository(WashTypeEntity)
    private washTypeRepository: Repository<WashTypeEntity>,
    private locationService: LocationService,
  ) {}

  async getAllWashTypes(): Promise<WashTypeModel[]> {
    const washTypes = await this.washTypeRepository.find();
    if (washTypes.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    return washTypes;
  }

  async getWashType(
    washTypeID: number,
    companyID: number,
  ): Promise<WashTypeModel> {
    if (washTypeID <= 0) {
      throw new BadRequestException('Wash type ID must be a positive integer');
    }
    const washType = await this.washTypeRepository.findOne(washTypeID, {
      relations: ['location', 'location.company'],
    });
    if (!washType) {
      throw new NotFoundException(`Wash type with ID ${washTypeID} not found`);
    }
    if (washType.location.company.id !== companyID) {
      throw new ForbiddenException(
        `Not allowed to access wash type with ID ${washTypeID}`,
      );
    }
    return washType;
  }

  async createWashType(
    dto: CreateWashTypeDto,
    companyID: number,
  ): Promise<WashTypeModel> {
    dto.location = await this.locationService.getLocation(dto.location.id);
    const newWashType = this.washTypeRepository.create(dto);
    await this.washTypeRepository.save(newWashType);
    return await this.getWashType(newWashType.id, companyID);
  }

  async updateWashType(
    washTypeID: number,
    dto: UpdateWashTypeDto,
    companyID: number,
  ): Promise<WashTypeModel> {
    if (washTypeID != dto.id) {
      throw new BadRequestException('Wash type ID does not match parameter ID');
    }
    await this.getWashType(dto.id, companyID); // will throw exception if it does not exist already, id is negative or forbidden
    await this.washTypeRepository.save(dto);
    return await this.getWashType(washTypeID, companyID);
  }

  // note that already soft-deleted entries can be soft-deleted again
  async deleteWashType(
    washTypeID: number,
    companyID: number,
  ): Promise<boolean> {
    if (washTypeID <= 0) {
      throw new BadRequestException('Wash type ID must be a positive integer');
    }
    await this.getWashType(washTypeID, companyID); // will throw exception if it does not exist already, id is negative or forbidden
    const deleteResponse = await this.washTypeRepository.softDelete(washTypeID);
    if (!deleteResponse.affected) {
      throw new InternalServerErrorException(
        `Operation to delete Wash type with ID ${washTypeID} failed`,
      );
    }
    return true;
  }
}
