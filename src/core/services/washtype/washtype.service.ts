import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { Repository } from 'typeorm';
import { WashTypeModel } from '../../models/washtype.model';
import { CreateWashTypeDto } from '../../../api/dtos/create-washtype.dto';
import { CompanyService } from '../company/company.service';
import { UpdateWashTypeDto } from '../../../api/dtos/update-washtype.dto';

@Injectable()
export class WashTypeService {
  constructor(
    @InjectRepository(WashTypeEntity)
    private washTypeRepository: Repository<WashTypeEntity>,
    private companyService: CompanyService,
  ) {}

  async getAllWashTypes(): Promise<WashTypeModel[]> {
    const washTypes = await this.washTypeRepository.find({
      relations: ['company'],
    });
    if (washTypes.length == 0) {
      throw new HttpException('No elements found', HttpStatus.NO_CONTENT);
    }
    return washTypes;
  }

  async getWashType(id: number): Promise<WashTypeModel> {
    if (id <= 0) {
      throw new BadRequestException('Wash type ID must be a positive integer');
    }
    const washType = await this.washTypeRepository.findOne(id, {
      relations: ['company'],
    });
    if (!washType) {
      throw new NotFoundException(`Wash type with ID ${id} not found`);
    }
    return washType;
  }

  async createWashType(dto: CreateWashTypeDto): Promise<WashTypeModel> {
    dto.company = await this.companyService.getCompany(dto.company.id);
    const newWashType = this.washTypeRepository.create(dto);
    await this.washTypeRepository.save(newWashType);
    return await this.getWashType(newWashType.id);
  }

  async updateWashType(
    id: number,
    dto: UpdateWashTypeDto,
  ): Promise<WashTypeModel> {
    if (id != dto.id) {
      throw new BadRequestException('Wash type ID does not match parameter ID');
    }
    await this.getWashType(dto.id); // will throw exception if it does not exist already, or id is negative
    await this.washTypeRepository.save(dto);
    return await this.getWashType(id);
  }

  // will NOT delete many-many relations with locations
  // note that already soft-deleted entries can be soft-deleted again
  async deleteWashType(id: number) {
    if (id <= 0) {
      throw new BadRequestException('Wash type ID must be a positive integer');
    }
    const deleteResponse = await this.washTypeRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Wash type with ID ${id} not found`);
    }
  }
}
