import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import RoleGuard from 'src/core/authentication/role.guard';
import Role from 'src/core/authentication/role.enum';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Gets all customers' })
  @ApiResponse({ status: 400, description: 'Fails miserably' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  async getAllCustomers() {
    return await this.service.getAllCustomers();
  }
}
