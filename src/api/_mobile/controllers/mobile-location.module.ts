import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from '../../../infrastructure/entities/location.entity';
import { LocationService } from '../../../core/services/location/location.service';
import { LocationsController } from './locations/locations.controller';
import { CompanyModule } from '../../_web/controllers/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), CompanyModule],
  controllers: [LocationsController],
  providers: [LocationService],
  exports: [LocationService],
})
export class MobileLocationModule {}
