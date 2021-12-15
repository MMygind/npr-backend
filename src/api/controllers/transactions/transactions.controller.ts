import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NumberStringParam } from '../../utilities/numberstringparam';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TransactionModel } from '../../../core/models/transaction.model';
import { CreateTransactionDto } from '../../dtos/create-transaction.dto';
import { PlateDetectionDto } from '../../dtos/plate-detection.dto';

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

  @Get('/byUser')
  @ApiOperation({
    summary:
      'Gets all transactions and pagination metadata for the specified user',
    description:
      'Gets all transactions and pagination metadata from the database for the specified user',
  })
  @ApiOkResponse({ description: 'All transactions returned' })
  @ApiNoContentResponse({ description: 'Could not find transactions' })
  async getAllTransactionsByUser(
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

  @Post()
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiOkResponse({ description: 'Transaction created and returned' })
  @ApiBadRequestResponse({
    description: 'Failed to create transaction as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Associated location or washtype not found' })
  @ApiForbiddenResponse({
    description: 'Could not create transaction with inaccessible location',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTransaction(@Body() dto: CreateTransactionDto) {
    const hardcodedCustomerID = 1;
    return await this.service.createTransaction(dto, hardcodedCustomerID);
  }

  @Post('/plateDetection')
  @ApiOperation({
    description: 'Update last detected license plate for location',
  })
  newLicensePlateDetection(@Body() dto: PlateDetectionDto) {
    return this.service.newLicensePlateDetection(dto);
  }

  @Get('/checkPlate/:id')
  @ApiOperation({
    summary:
      'Check if last detected license plate at location ID matches any of customers',
  })
  @ApiOkResponse({
    description:
      'Matching detected license plate returned - null if not matching',
  })
  @ApiBadRequestResponse({
    description: 'Failed as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Location with ID not found' })
  @ApiForbiddenResponse({
    description: 'Could not create transaction with inaccessible location',
  })
  async getMatchingLicensePlateAtLocation(@Param() params: NumberStringParam) {
    const hardcodedCustomerID = 1;
    return await this.service.getMatchingLicensePlateAtLocation(
      params.id,
      hardcodedCustomerID,
    );
  }
}
