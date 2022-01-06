import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { WashTypeService } from '../../../core/services/washtype/washtype.service';
import { CompanyModule } from '../../_web/controllers/company.module';
import { WashTypesController } from './washtypes/washtypes.controller';
import { MobileLocationModule } from './mobile-location.module';

@Module({
  imports: [TypeOrmModule.forFeature([WashTypeEntity]), MobileLocationModule, CompanyModule],
  controllers: [WashTypesController],
  providers: [WashTypeService],
})
export class MobileWashTypeModule {}
