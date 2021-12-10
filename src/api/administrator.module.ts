import { Module } from '@nestjs/common';
import { AdministratorsController } from './controllers/administrators/administrators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorEntity } from '../infrastructure/entities/administrator.entity';
import { AdministratorService } from '../core/services/administrator/administrator.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdministratorEntity])],
  controllers: [AdministratorsController],
  providers: [AdministratorService],
})
export class AdministratorModule {}
