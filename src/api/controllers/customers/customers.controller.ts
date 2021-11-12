import { Controller, Get } from '@nestjs/common';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SubscriptionModel } from '../../../core/models/subscription.model';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all customers',
    description: 'Gets all customers from the database',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllCustomers() {
    return await this.service.getAllCustomers();
  }
}
