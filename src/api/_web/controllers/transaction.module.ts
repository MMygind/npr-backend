import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../infrastructure/entities/transaction.entity';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { CustomerModule } from './customer.module';
import { LocationModule } from './location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CustomerModule,
    LocationModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionModule {}
