import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NumberStringParam } from '../../utilities/numberstringparam';
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
    summary: 'Gets all transactions and pagination metadata',
    description:
      'Gets all transactions and pagination metadata from the database',
  })
  @ApiOkResponse({ description: 'All transactions returned' })
  @ApiNoContentResponse({ description: 'Could not find transactions' })
  async getAllTransactions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('queryValue') queryValue: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('washType') washType: string,
    @Query('location') location: string,
    @Query('customerType') customerType: string,
  ): Promise<Pagination<TransactionModel>> {
    if (
      (queryValue === null &&
        startDate === null &&
        washType === null &&
        location === null &&
        customerType === null) ||
      (queryValue === undefined &&
        startDate === undefined &&
        washType === undefined &&
        location === undefined &&
        customerType === undefined)
    ) {
      return await this.service.getAllTransactions({
        page,
        limit,
        route: 'http://localhost:3000/transactions',
      });
    } else {
      return this.service.getFilteredTransactions(
        {
          page,
          limit,
          route: 'http://localhost:3000/transactions',
        },
        queryValue,
        startDate,
        endDate,
        washType,
        location,
        customerType,
      );
    }
  }

  @Get('/byUser')
  @ApiOperation({
    summary:
      'Gets all transactions and pagination metadata for the specified user',
    description:
      'Gets all transactions and pagination metadata from the database for the specified user',
  })
  @ApiOkResponse({ description: 'All transactions returned' })
  @ApiNoContentResponse({ description: 'Could not find transactions' })
  async getTransactionsByUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TransactionModel>> {
    return await this.service.getAllTransactionsByUser(
      {
        page,
        limit,
        route: 'http://localhost:3000/transactions/byUser',
      },
      1,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets transaction with specified ID' })
  @ApiOkResponse({ description: 'Transaction with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get transaction as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async getTransactionById(@Param() params: NumberStringParam) {
    return await this.service.getTransaction(params.id);
  }
}
