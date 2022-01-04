import {
  Body,
  Controller,
  DefaultValuePipe,
  Get, Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from '../../../../core/services/transaction/transaction.service';
import {
  ApiBadRequestResponse, ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TransactionModel } from '../../../../core/models/transaction.model';
import JwtAuthenticationGuard from '../../../../core/authentication/web/guards/jwt-auth.guard';
import RequestWithCustomer from '../../../../core/authentication/mobile/request-with-customer.interface';
import { CreateTransactionDto } from '../../../dtos/create-transaction.dto';
import { NumberStringParam } from '../../../utilities/numberstringparam';

@Controller('mobile/transactions')
export class TransactionsController {
  constructor(private service: TransactionService) {
  }

  @UseGuards(JwtAuthenticationGuard)
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
    @Req() request: RequestWithCustomer,
  ): Promise<Pagination<TransactionModel>> {
    const customer = request.user
    return await this.service.getAllTransactionsByUser(
      {
        page,
        limit,
        route: '/transactions/byUser',
      },
      customer.id,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiOkResponse({ description: 'Transaction created and returned' })
  @ApiBadRequestResponse({
    description: 'Failed to create transaction as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Associated location or washtypes not found' })
  @ApiForbiddenResponse({
    description: 'Could not create transaction with inaccessible location',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTransaction(@Body() dto: CreateTransactionDto, @Req() request: RequestWithCustomer) {
    const customer = request.user
    return await this.service.createTransaction(dto, customer.id);
  }

  @UseGuards(JwtAuthenticationGuard)
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
  async getMatchingLicensePlateAtLocation(@Param() params: NumberStringParam, @Req() request: RequestWithCustomer) {
    const customer = request.user
    return await this.service.getMatchingLicensePlateAtLocation(
      params.id,
      customer.id,
    );
  }
}
