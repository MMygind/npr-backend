import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { WashTypesController } from './washtypes/washtypes.controller';
import { WashTypeService } from '../../../core/services/washtype/washtype.service';
import { LocationModule } from './location.module';
import { CompanyModule } from './company.module';

@Module({
  imports: [TypeOrmModule.forFeature([WashTypeEntity]), LocationModule, CompanyModule],
  controllers: [WashTypesController],
  providers: [WashTypeService],
})
export class WashTypeModule {}
