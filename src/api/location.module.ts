import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from '../infrastructure/entities/location.entity';
import { LocationsController } from './controllers/locations/locations.controller';
import { LocationService } from '../core/services/location/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  controllers: [LocationsController],
  providers: [LocationService],
})
export class LocationModule {}
