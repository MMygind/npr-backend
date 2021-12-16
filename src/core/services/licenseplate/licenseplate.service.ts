import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicensePlateEntity } from '../../../infrastructure/entities/licenseplate.entity';
import { LicensePlateModel } from '../../models/licenseplate.model';
import { CreateLicensePlateDto } from '../../../api/dtos/create-licenseplate.dto';

@Injectable()
export class LicensePlateService {
  constructor(
    @InjectRepository(LicensePlateEntity)
    private licensePlateRepository: Repository<LicensePlateEntity>,
  ) {
  }

  async createLicensePlate(
    plateDto: CreateLicensePlateDto,
    customerId: number,
  ): Promise<LicensePlateModel> {

    const newPlate = this.licensePlateRepository.create(plateDto);
    await this.licensePlateRepository.save(newPlate);
    console.log(newPlate);
    return newPlate;
  }

}
