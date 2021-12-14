import { Body, Controller, Post } from '@nestjs/common';
import { LicensePlateService } from '../../../core/services/licenseplate/licenseplate.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LicensePlateModel } from '../../../core/models/licenseplate.model';

@Controller('licensePlates')
export class LicensePlateController {
  constructor(private service: LicensePlateService) {
  }

  @Post()
  @ApiOperation({summary: 'Create new license plate'})
  @ApiCreatedResponse({description: 'License plate created'})
  @ApiBadRequestResponse({description: 'Failed to create license plate'})
  @ApiNotFoundResponse({description: 'Logged in customer not found'})

  async createLicensePlate(@Body() plateModel: LicensePlateModel) {
    return await this.service.createLicensePlate(plateModel);
  }
}
