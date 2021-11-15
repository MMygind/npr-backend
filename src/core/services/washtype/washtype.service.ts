import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { Repository } from 'typeorm';
import { WashTypeModel } from '../../models/washtype.model';

@Injectable()
export class WashTypeService {
  constructor(
    @InjectRepository(WashTypeEntity)
    private washTypeRepository: Repository<WashTypeEntity>,
  ) {}

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
}
