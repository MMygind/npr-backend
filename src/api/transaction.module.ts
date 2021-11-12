import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../infrastructure/entities/transaction.entity';
import { TransactionsController } from './controllers/transactions/transactions.controller';
import { TransactionService } from '../core/services/transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionModule {}
