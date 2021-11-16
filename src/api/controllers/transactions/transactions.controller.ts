import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TransactionModel } from '../../../core/models/transaction.model';

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
  async getAllTransactions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TransactionModel>> {
    return await this.service.getAllTransactions({
      page,
      limit,
      route: 'http://localhost:3000/transactions',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets transaction with specified ID' })
  @ApiOkResponse({ description: 'Transaction with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get transaction as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async getTransactionById(@Param('id') params: number) {
    return await this.service.getTransaction(params);
  }
}
