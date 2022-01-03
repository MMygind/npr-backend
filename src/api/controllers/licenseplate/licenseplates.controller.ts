import { Body, Controller, Get, Post } from '@nestjs/common';
import { LicensePlateService } from '../../../core/services/licenseplate/licenseplate.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateLicensePlateDto } from '../../dtos/create-licenseplate.dto';

@Controller('licensePlates')
export class LicensePlatesController {
  constructor(private service: LicensePlateService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all license plates' })
  @ApiOkResponse({ description: 'All license plates returned' })
  @ApiNoContentResponse({ description: 'Could not find license plates' })
  async getAllLicensePlates() {
    return await this.service.getAllLicensePlates();
  }

  @Post()
  @ApiOperation({summary: 'Create new license plate'})
  @ApiCreatedResponse({description: 'License plate created'})
  @ApiBadRequestResponse({description: 'Failed to create license plate'})
  @ApiNotFoundResponse({description: 'Logged in customer not found'})

  async createLicensePlate(@Body() plateDto: CreateLicensePlateDto) {
    const customerId = 1;
    return await this.service.createLicensePlate(plateDto, customerId);
  }
}
