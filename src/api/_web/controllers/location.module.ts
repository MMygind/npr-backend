import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from '../../../infrastructure/entities/location.entity';
import { LocationsController } from '../../_web/controllers/locations/locations.controller';
import { LocationService } from '../../../core/services/location/location.service';
import { CompanyModule } from './company.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), CompanyModule],
  controllers: [LocationsController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
