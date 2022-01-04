import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashTypeEntity } from '../../../infrastructure/entities/washtype.entity';
import { LocationModule } from '../../_web/controllers/location.module';
import { WashTypesController } from '../../_web/controllers/washtypes/washtypes.controller';
import { WashTypeService } from '../../../core/services/washtype/washtype.service';

@Module({
  imports: [TypeOrmModule.forFeature([WashTypeEntity]), LocationModule],
  controllers: [WashTypesController],
  providers: [WashTypeService],
})
export class MobileWashTypeModule {}
