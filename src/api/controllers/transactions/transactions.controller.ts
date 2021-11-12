import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all transactions',
    description: 'Gets all transactions from the database',
  })
  @ApiOkResponse({ description: 'All transactions returned' })
  @ApiNotFoundResponse({ description: 'Could not find transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();
  }

  @Get(':id')
  async getTransactionById(@Param() params) {
    return await this.service.getTransactionById(params.id);
  }
}
