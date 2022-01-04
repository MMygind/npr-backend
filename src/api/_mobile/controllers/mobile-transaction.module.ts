import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { CustomerModule } from '../../_web/controllers/customer.module';
import { LocationModule } from '../../_web/controllers/location.module';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { TransactionsController } from './transactions/transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CustomerModule,
    LocationModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class MobileTransactionModule {}
