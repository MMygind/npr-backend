import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicensePlateEntity } from '../../../infrastructure/entities/licenseplate.entity';
import { LicensePlateModel } from '../../models/licenseplate.model';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class LicensePlateService {
  constructor(
    @InjectRepository(LicensePlateEntity)
    private licensePlateRepository: Repository<LicensePlateEntity>,
    private customerService: CustomerService,
  ) {
  }

  async createLicensePlate(
    plateModel: LicensePlateModel,
  ): Promise<LicensePlateModel> {

    plateModel.customer = await this.customerService.getCustomerById(1);
    const newPlate = this.licensePlateRepository.create(plateModel);
    await this.licensePlateRepository.save(newPlate);
    return newPlate;
  }

}
