import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { NumberStringParam } from '../utilities/numberstringparam';

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all transactions',
    description: 'Gets all transactions from the database',
  })
  @ApiOkResponse({ description: 'All transactions returned' })
  @ApiNoContentResponse({ description: 'Could not find transactions' })
  async getAllTransactions() {
    return await this.service.getAllTransactions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets transaction with specified ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Positive integer for transaction ID',
  })
  @ApiOkResponse({ description: 'Transaction with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get transaction as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async getTransactionById(@Param() params: NumberStringParam) {
    return await this.service.getTransaction(params.id);
  }
}
