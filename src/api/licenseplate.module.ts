import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensePlateEntity } from '../infrastructure/entities/licenseplate.entity';
import { LicensePlatesController } from './controllers/licenseplate/licenseplates.controller';
import { LicensePlateService } from '../core/services/licenseplate/licenseplate.service';

@Module({
  imports: [TypeOrmModule.forFeature([LicensePlateEntity])],
  controllers: [LicensePlatesController],
  providers: [LicensePlateService],
})
export class LicensePlateModule {}
