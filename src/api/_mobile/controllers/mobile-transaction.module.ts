import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { TransactionsController } from './transactions/transactions.controller';
import { IotController } from '../../_iot/controllers/iot.controller';
import { MobileCustomerModule } from './mobile-customer.module';
import { MobileLocationModule } from './mobile-location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    MobileCustomerModule,
    MobileLocationModule
  ],
  controllers: [TransactionsController, IotController],
  providers: [TransactionService],
})
export class MobileTransactionModule {}
