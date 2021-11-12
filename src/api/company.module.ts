import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../infrastructure/entities/company.entity';
import { CompaniesController } from './controllers/companies/companies.controller';
import { CompanyService } from '../core/services/company/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompaniesController],
  providers: [CompanyService],
})
export class CompanyModule {}
