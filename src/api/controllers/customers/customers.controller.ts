import { Controller, Get } from '@nestjs/common';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Gets all customers' })
  @ApiResponse({ status: 400, description: 'Fails miserably' })
  async getAllCustomers() {
    return await this.service.getAllCustomers();
  }
}
