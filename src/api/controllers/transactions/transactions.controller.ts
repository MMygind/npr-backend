import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}


  @Get()
  @ApiResponse({ status: 200, description: 'Gets all transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();

  @Get(':id')
  async getTransactionById(@Param() params) {
    return await this.service.getTransactionById(params.id);
  }
}
