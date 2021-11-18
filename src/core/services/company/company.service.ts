import { HttpException, HttpStatus,Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../../../infrastructure/entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyModel } from '../../models/company.model';
import CreateCompanyDto from 'src/core/dtos/createCompany.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  getCompanyWithoutPassword(oldCompany: CompanyModel): CompanyModel {
    const newCompany: CompanyModel = {
      id: oldCompany.id,
      name: oldCompany.name,
      email: oldCompany.email,
      creationDate: oldCompany.creationDate,
      phoneNumber: oldCompany.phoneNumber,
    };
    return newCompany;
  }

  async getByEmail(email: string) {
    const company = await this.companyRepository.findOne({ email });
    if (company) {
      return company;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }
 
  async create(companyData: CreateCompanyDto) {
    const newCompany = await this.companyRepository.create(companyData);
    await this.companyRepository.save(newCompany);
    return newCompany;
  }

  async getById(id: number) {
    const company = await this.companyRepository.findOne({ id });
    if (company) {
      return company;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
