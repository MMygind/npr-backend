import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CompanyEntity } from '../../../infrastructure/entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyModel } from '../../models/company.model';
import CreateCompanyDto from 'src/api/_web/dtos/create-company.dto';

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

  async getByEmail(email: string) {
    const company = await this.companyRepository.findOne({ email });
    if (company) {
      return company;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.companyRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.companyRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }
}
