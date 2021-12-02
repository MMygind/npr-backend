import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from '../../../core/services/customer/customer.service';
import { ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import RoleGuard from 'src/core/authentication/role.guard';
import Role from 'src/core/authentication/role.enum';
import RequestWithCompany from 'src/core/authentication/requestWithCompany.interface';
import { string } from '@hapi/joi';

@Controller('customers')
export class CustomersController {
  constructor(private service: CustomerService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Gets all customers' })
  @ApiResponse({ status: 400, description: 'Fails miserably' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  async getAllCustomers(@Req() request: RequestWithCompany) {
    const { user } = request;
    const id = user.id;
    console.log("user id: " + id);
    return await this.service.getAllCustomers();
  }
}
