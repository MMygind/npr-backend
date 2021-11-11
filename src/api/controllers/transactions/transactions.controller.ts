import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all transactions',
    description:
      'Requests that an unfiltered list of all transactions is returned',
  })
  @ApiResponse({ status: 200, description: 'Gets all transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Gets transaction with specified ID',
    description:
      'Requests that transaction with ID specified in path is returned',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for transaction ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns transaction with specified ID',
  })
  async getTransactionById(@Param() params) {
    return await this.service.getTransactionById(params.id);
  }
}
