import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashTypeEntity } from '../infrastructure/entities/washtype.entity';
import { WashTypesController } from './controllers/washtypes/washtypes.controller';
import { WashTypeService } from '../core/services/washtype/washtype.service';
import { CompanyModule } from './company.module';

@Module({
  imports: [TypeOrmModule.forFeature([WashTypeEntity]), CompanyModule],
  controllers: [WashTypesController],
  providers: [WashTypeService],
  exports: [WashTypeService],
})
export class WashTypeModule {}
