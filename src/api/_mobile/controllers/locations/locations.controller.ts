import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LocationService } from '../../../../core/services/location/location.service';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../../../core/authentication/mobile/guards/jwt-auth.guard';
import RequestWithCustomer from '../../../../core/authentication/mobile/request-with-customer.interface';

@Controller('mobile/locations')
export class LocationsController {
  constructor(private service: LocationService) {
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/thisCompany')
  @ApiOperation({ summary: 'Get locations for authenticated company user' })
  @ApiOkResponse({
    description: 'All locations for authenticated company user returned',
  })
  @ApiNoContentResponse({
    description: 'Could not find locations for authenticated company user',
  })
  async getCompanyLocations(@Req() request: RequestWithCustomer) {
    const customer = request.user;
    return await this.service.getCompanyLocations(customer.company.id);
  }
}
