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
import { UpdateCustomerDto } from '../../dtos/update-customer.dto';
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
    @Req() req: RequestWithCompany,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('queryValue') queryValue: string,
    @Query('active') active: boolean,
    @Query('subscription') subscription: string,
  ) {
    try {
      const company = req.user;
      return await this.service.getAllFilteredCustomers(
        { page, limit, route: '/customers' },
        queryValue,
        active,
        subscription,
      );
    } catch {
      throw new BadRequestException('Could not get list of customers');
    }
  }

  @Put()
  @ApiOperation({
    summary: 'Updates a customer',
    description: 'Updates a customer with the new information',
  })
  @ApiResponse({ status: 200, description: 'Customer was updated' })
  @ApiResponse({ status: 404, description: 'Customer was not found' })
  async updateCustomer(@Body() customer: UpdateCustomerDto) {
    try {
      return await this.service.updateCustomer(customer);
    } catch {
      throw new NotFoundException('Customer was not found');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets customer with specified ID' })
  @ApiOkResponse({ description: 'Customer with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get customer as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async getCustomerById(@Param() params: NumberStringParam) {
    return await this.service.getCustomerById(1); //Hard coded ID so far
  }
}
