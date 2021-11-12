import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Gets all transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets transaction with specified ID' })
  @ApiOkResponse({ description: 'Transaction with specified ID returned' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async getTransactionById(@Param('id') params: number) {
    return await this.service.getTransactionById(params);
  }
}
