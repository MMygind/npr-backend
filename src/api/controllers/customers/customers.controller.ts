import { CustomerService } from '../../../core/services/customer/customer.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import RoleGuard from 'src/core/authentication/role.guard';
import Role from 'src/core/authentication/role.enum';
import RequestWithCompany from 'src/core/authentication/requestWithCompany.interface';
import { string } from '@hapi/joi';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateCustomerDto } from '../../../core/dtos/updateCustomer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) { }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({
    summary: 'Gets all customers',
    description: 'Gets all customers from the database',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAllFilteredCustomers(
    @Query('active') active: boolean,
    @Query('subscription') subscription: string,
    @Req() request: RequestWithCompany,
  ) {
    try {
      const { user } = request;
      const id = user.id;
      console.log("user id: " + id);
      return await this.service.getAllFilteredCustomers(active, subscription);
    }
    catch {
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
}
