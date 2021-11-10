import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from '../../../core/services/transaction/transaction.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get(':id')
  async getTransactionById(@Param() params) {
    return await this.service.getTransactionById(params.id);
  }
}
