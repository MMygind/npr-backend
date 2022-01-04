import {
  Body,
  Controller,
  Get, NotFoundException, Param, Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import CustomerJwtAuthenticationGuard from 'src/core/authentication/mobile/guards/jwt-auth.guard';
import RequestWithCustomer from 'src/core/authentication/mobile/request-with-customer.interface';
import { CustomerService } from 'src/core/services/customer/customer.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCustomerDto } from '../../../dtos/update-customer.dto';
import JwtAuthenticationGuard from 'src/core/authentication/mobile/guards/jwt-auth.guard';
import { NumberStringParam } from '../../../utilities/numberstringparam';

@Controller('mobile/customers')
export class CustomersController {
  constructor(private service: CustomerService) { }

  @UseGuards(JwtAuthenticationGuard)
  @Put()
  @ApiOperation({
    summary: 'Updates a customer',
    description: 'Updates a customer with the new information',
  })
  @ApiResponse({ status: 200, description: 'Customer was updated' })
  @ApiResponse({ status: 404, description: 'Customer was not found' })
  async updateCustomer(@Body() customer: UpdateCustomerDto, @Req() request: RequestWithCustomer) {
    try {
      return await this.service.updateCustomer(customer);
    } catch {
      throw new NotFoundException('Customer was not found');
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Gets customer with specified ID' })
  @ApiOkResponse({ description: 'Customer with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get customer as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async getLoggedInCustomer(@Param() params: NumberStringParam, @Req() request: RequestWithCustomer) {
    const customer = request.user;
    return await this.service.getCustomerById(customer.id);
  }
}
