import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import CustomerJwtAuthenticationGuard from 'src/core/authentication/mobile/guards/jwt-auth.guard';
import RequestWithCustomer from 'src/core/authentication/mobile/request-with-customer.interface';
import { CustomerService } from 'src/core/services/customer/customer.service';

@Controller('mobile/customers')
export class CustomersController {
  constructor(private service: CustomerService) { }

  @UseGuards(CustomerJwtAuthenticationGuard)
  @Get()
  async GetCustomersExample(@Req() req: RequestWithCustomer) {
    const costumer = req.user;
    return "hej costumer id: " + costumer.id;
  }
}
