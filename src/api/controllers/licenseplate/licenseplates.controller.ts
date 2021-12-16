import { Body, Controller, Post } from '@nestjs/common';
import { LicensePlateService } from '../../../core/services/licenseplate/licenseplate.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateLicensePlateDto } from '../../dtos/create-licenseplate.dto';

@Controller('licensePlates')
export class LicensePlatesController {
  constructor(private service: LicensePlateService) {
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
