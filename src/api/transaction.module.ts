import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../infrastructure/entities/transaction.entity';
import { TransactionsController } from './controllers/transactions/transactions.controller';
import { TransactionService } from '../core/services/transaction/transaction.service';
import { CompanyModule } from './company.module';
import { CustomerModule } from './customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CompanyModule,
    CustomerModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionModule {}
