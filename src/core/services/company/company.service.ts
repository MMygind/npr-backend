import { Injectable } from '@nestjs/common';
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

  /**
   * Takes company object with passwords properties,
   * and constructs and returns new copy without password properties
   * @param oldCompany with passwordHash and passwordSalt properties
   * @returns newCompany a copy without those properties
   */
  getCompany(oldCompany: CompanyModel): CompanyModel {
    const newCompany: CompanyModel = {
      id: oldCompany.id,
      name: oldCompany.name,
      email: oldCompany.email,
      creationDate: oldCompany.creationDate,
      phoneNumber: oldCompany.phoneNumber,
    };
    return newCompany;
  }
}
