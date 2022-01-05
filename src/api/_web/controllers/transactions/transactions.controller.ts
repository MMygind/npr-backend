import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NumberStringParam } from '../../../utilities/numberstringparam';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query, Req, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TransactionModel } from 'src/core/models/transaction.model';
import { CreateTransactionDto } from 'src/api/dtos/create-transaction.dto';
import { PlateDetectionDto } from 'src/api/dtos/plate-detection.dto';
import JwtAuthenticationGuard from '../../../../core/authentication/web/guards/jwt-auth.guard';
import RequestWithCompany from '../../../../core/authentication/web/request-with-company.interface';

@Controller('web/transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {}

  @UseGuards(JwtAuthenticationGuard)
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
    @Req() request: RequestWithCompany,
  ): Promise<Pagination<TransactionModel>> {
    const company = request.user;
    return await this.service.getFilteredTransactions(
      {
        page,
        limit,
        route: '/transactions',
      },
      queryValue,
      startDate,
      endDate,
      washType,
      location,
      customerType,
      company.id
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
