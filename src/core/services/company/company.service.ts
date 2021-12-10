import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../infrastructure/entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyModel } from '../../models/company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async getCompany(companyID: number): Promise<CompanyModel> {
    this.validateCompanyIDIsPositive(companyID);
    const company = await this.companyRepository.findOne(companyID);
    this.validateCompanyExists(companyID, company);
    return company;
  }

  async getCompanyWithLocationAndWashTypes(
    companyID: number,
  ): Promise<CompanyModel> {
    this.validateCompanyIDIsPositive(companyID);
    const company = await this.companyRepository.findOne(companyID, {
      relations: ['locations', 'locations.washTypes'],
    });
    this.validateCompanyExists(companyID, company);
    return company;
  }

  validateCompanyIDIsPositive(companyID: number) {
    if (companyID <= 0) {
      throw new BadRequestException('Company ID must be a positive integer');
    }
  }

  validateCompanyExists(companyID: number, company: CompanyModel) {
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyID} not found`);
    }
  }
}
