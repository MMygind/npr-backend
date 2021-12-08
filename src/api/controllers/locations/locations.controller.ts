import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from '../../../core/services/location/location.service';
import { NumberStringParam } from '../../utilities/numberstringparam';
import { LocationModel } from '../../../core/models/location.model';
import { CreateLocationDto } from '../../dtos/create-location.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateLocationDto } from '../../dtos/update-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private service: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiOkResponse({ description: 'All locations returned' })
  @ApiNoContentResponse({ description: 'Could not find locations' })
  async getAllLocations() {
    // should be admin only
    return await this.service.getAllLocations();
  }

  @Get('/thisCompany')
  @ApiOperation({ summary: 'Get all locations' })
  @ApiOkResponse({ description: 'All locations returned' })
  @ApiNoContentResponse({ description: 'Could not find locations' })
  async getCompanyLocations() {
    const hardcodedCompanyID = 1;
    return await this.service.getCompanyLocations(hardcodedCompanyID);
  }

  @Get(':id')
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
  }

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
  async createLocation(@Body() dto: CreateLocationDto) {
    const hardcodedCompanyID = 1;
    return await this.service.createLocation(dto, hardcodedCompanyID);
  }

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
  ) {
    const hardcodedCompanyID = 1;
    return await this.service.updateLocation(
      params.id,
      dto,
      hardcodedCompanyID,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes location with specified ID' })
  @ApiOkResponse({ description: 'Location with specified ID deleted' })
  @ApiBadRequestResponse({
    description: 'Failed to delete location as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async deleteLocation(@Param() params: NumberStringParam) {
    const hardcodedCompanyID = 1;
    return await this.service.deleteLocation(params.id, hardcodedCompanyID);
  }
}
