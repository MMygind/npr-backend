import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { TransactionEntity } from '../../infrastructure/entities/transaction.entity';
import { IotController } from './controllers/iot.controller';
import { CustomerModule } from '../_web/controllers/customer.module';
import { LocationModule } from '../_web/controllers/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]),
    CustomerModule,
    LocationModule],
  controllers: [IotController],
  providers: [TransactionService],
})
export class IotModule {}
