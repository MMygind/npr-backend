import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LicensePlateService } from '../../../../core/services/licenseplate/licenseplate.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateLicensePlateDto } from '../../../dtos/create-licenseplate.dto';
import JwtAuthenticationGuard from '../../../../core/authentication/mobile/guards/jwt-auth.guard';
import RequestWithCustomer from '../../../../core/authentication/mobile/request-with-customer.interface';

@Controller('mobile/licensePlates')
export class LicensePlatesController {
  constructor(private service: LicensePlateService) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: 'Get all license plates' })
  @ApiOkResponse({ description: 'All license plates returned' })
  @ApiNoContentResponse({ description: 'Could not find license plates' })
  async getAllLicensePlates() {
    return await this.service.getAllLicensePlates();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiOperation({summary: 'Create new license plate'})
  @ApiCreatedResponse({description: 'License plate created'})
  @ApiBadRequestResponse({description: 'Failed to create license plate'})
  @ApiNotFoundResponse({description: 'Logged in customer not found'})

  async createLicensePlate(@Body() plateDto: CreateLicensePlateDto, @Req() request: RequestWithCustomer) {
    const customer = request.user;
    return await this.service.createLicensePlate(plateDto, customer.id);
  }
}
