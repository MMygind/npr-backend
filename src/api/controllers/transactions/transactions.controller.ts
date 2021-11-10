import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Gets all transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();
  }
}
