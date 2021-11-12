import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashTypeEntity } from '../infrastructure/entities/washtype.entity';
import { WashTypesController } from './controllers/washtypes/washtypes.controller';
import { WashTypeService } from '../core/services/washtype/washtype.service';

@Module({
  imports: [TypeOrmModule.forFeature([WashTypeEntity])],
  controllers: [WashTypesController],
  providers: [WashTypeService],
})
export class WashTypeModule {}
