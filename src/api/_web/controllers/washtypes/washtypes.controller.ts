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
import { WashTypeService } from '../../../../core/services/washtype/washtype.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NumberStringParam } from '../../../utilities/numberstringparam';
import { CreateWashTypeDto } from '../../../dtos/create-washtype.dto';
import { UpdateWashTypeDto } from '../../../dtos/update-washtype.dto';
import JwtAuthenticationGuard from '../../../../core/authentication/web/guards/jwt-auth.guard';
import RequestWithCompany from '../../../../core/authentication/web/request-with-company.interface';

@Controller('washtypes')
export class WashTypesController {
  constructor(private service: WashTypeService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('/byLocation/:id')
  @ApiOperation({
    summary: 'Get all wash types for location with specified ID',
  })
  @ApiOkResponse({
    description: 'All wash types for location with specified ID returned',
  })
  @ApiNoContentResponse({
    description: 'Could not find wash types for location with specified ID',
  })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async getLocationWashTypes(@Param() params: NumberStringParam, @Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.getLocationWashTypes(
      params.id,
      company.id,
    );
  }

  /*@Get(':id')
  @ApiOperation({ summary: 'Get wash type with specified ID' })
  @ApiOkResponse({ description: 'Wash type with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Wash type not found' })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async getWashType(@Param() params: NumberStringParam) {
    const hardcodedCompanyID = 1;
    return await this.service.getWashType(params.id, hardcodedCompanyID);
  }*/

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Create new wash type' })
  @ApiCreatedResponse({ description: 'Wash type created and returned' })
  @ApiBadRequestResponse({
    description: 'Failed to create wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Associated company not found' })
  @ApiForbiddenResponse({
    description: 'Could not create wash type with inaccessible location',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  // strips properties which do not have decorators
  async createWashType(@Body() dto: CreateWashTypeDto, @Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.createWashType(dto, company.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Updates wash type with specified ID' })
  @ApiOkResponse({
    description: 'Wash type with specified ID updated and returned',
  })
  @ApiBadRequestResponse({
    description: 'Failed to update wash type as request was malformed',
  })
  @ApiNotFoundResponse({
    description: 'Associated company not found',
  })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  // strips properties which do not have decorators
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateWashType(
    @Param() params: NumberStringParam,
    @Body() dto: UpdateWashTypeDto,
    @Req() request: RequestWithCompany
  ) {
    const company = request.user;
    return await this.service.updateWashType(
      params.id,
      dto,
      company.id,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes wash type with specified ID' })
  @ApiOkResponse({ description: 'Wash type with specified ID deleted' })
  @ApiBadRequestResponse({
    description: 'Failed to delete wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Wash type not found' })
  @ApiForbiddenResponse({ description: 'Not allowed to access resource' })
  async deleteWashType(@Param() params: NumberStringParam, @Req() request: RequestWithCompany) {
    const company = request.user;
    return await this.service.deleteWashType(params.id, company.id);
  }
}
