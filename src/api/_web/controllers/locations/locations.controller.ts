import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Req, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from '../../../../core/services/location/location.service';
import { NumberStringParam } from '../../../utilities/numberstringparam';
import { LocationModel } from '../../../../core/models/location.model';
import { CreateLocationDto } from '../../../dtos/create-location.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateLocationDto } from '../../../dtos/update-location.dto';
import JwtAuthenticationGuard from '../../../../core/authentication/web/guards/jwt-auth.guard';
import RequestWithCompany from '../../../../core/authentication/web/request-with-company.interface';

@Controller('locations')
export class LocationsController {
  constructor(private service: LocationService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('/thisCompany')
  @ApiOperation({ summary: 'Get locations for authenticated company user' })
  @ApiOkResponse({
    description: 'All locations for authenticated company user returned',
  })
  @ApiNoContentResponse({
    description: 'Could not find locations for authenticated company user',
  })
  async getCompanyLocations(@Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.getCompanyLocations(company.id);
  }

  /*@Get(':id')
  @ApiOperation({ summary: 'Get location with specified ID' })
  @ApiOkResponse({ description: 'Location with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get location as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async getLocation(@Param() params: NumberStringParam) {
    const hardcodedCompanyID = 1;
    return await this.service.getLocation(params.id, hardcodedCompanyID);
  }*/

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Create new location' })
  @ApiCreatedResponse({ description: 'Location created and returned' })
  @ApiBadRequestResponse({
    description: 'Failed to create location as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Associated company not found' })
  @ApiForbiddenResponse({
    description: 'Could not create location with inaccessible company',
  })
  // strips properties which do not have decorators
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createLocation(@Body() dto: CreateLocationDto, @Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.createLocation(dto, company.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Updates location with specified ID' })
  @ApiOkResponse({
    description: 'Location with specified ID updated and returned',
  })
  @ApiBadRequestResponse({
    description: 'Failed to update location as request was malformed',
  })
  @ApiNotFoundResponse({
    description: 'One or more resources necessary for updating were missing',
  })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  // strips properties which do not have decorators
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateLocation(
    @Param() params: NumberStringParam,
    @Body() dto: UpdateLocationDto,
    @Req() request: RequestWithCompany
  ) {
    const company = request.user;
    return await this.service.updateLocation(
      params.id,
      dto,
      company.id,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes location with specified ID' })
  @ApiOkResponse({ description: 'Location with specified ID deleted' })
  @ApiBadRequestResponse({
    description: 'Failed to delete location as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async deleteLocation(@Param() params: NumberStringParam, @Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.deleteLocation(params.id, company.id);
  }
}
