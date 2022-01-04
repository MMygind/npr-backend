import JwtAuthenticationGuard from 'src/core/authentication/web/guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithCompany from 'src/core/authentication/web/request-with-company.interface';
import { UpdateCustomerDto } from '../../../dtos/update-customer.dto';
import { CustomerService } from 'src/core/services/customer/customer.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { NumberStringParam } from 'src/api/utilities/numberstringparam';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) { }

  //@UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({
    summary: 'Gets all customers',
    description: 'Gets all customers from the database',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAllFilteredCustomers(
    @Req() request: RequestWithCompany,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('queryValue') queryValue: string,
    @Query('active') active: boolean,
    @Query('subscription') subscription: string,
  ) {
    try {
      const company = request.user;
      return await this.service.getAllFilteredCustomers(
        { page, limit, route: '/customers' },
        queryValue,
        active,
        subscription,
        company.id
      );
    } catch {
      throw new BadRequestException('Could not get list of customers');
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put()
  @ApiOperation({
    summary: 'Updates a customer',
    description: 'Updates a customer with the new information',
  })
  @ApiResponse({ status: 200, description: 'Customer was updated' })
  @ApiResponse({ status: 404, description: 'Customer was not found' })
  async updateCustomer(@Body() customer: UpdateCustomerDto, @Req() request: RequestWithCompany) {
    try {
      return await this.service.updateCustomer(customer);
    } catch {
      throw new NotFoundException('Customer was not found');
    }
  }
}
