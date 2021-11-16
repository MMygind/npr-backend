import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { WashTypeService } from '../../../core/services/washtype/washtype.service';
import {
  ApiBadRequestResponse, ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from "@nestjs/swagger";
import { NumberStringParam } from "../../utilities/numberstringparam";
import { CreateLocationDto } from "../../dtos/create-location.dto";
import { UpdateLocationDto } from "../../dtos/update-location.dto";
import { CreateWashTypeDto } from "../../dtos/create-washtype.dto";
import { UpdateWashTypeDto } from "../../dtos/update-washtype.dto";

@Controller('washtypes')
export class WashTypesController {
  constructor(private service: WashTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all wash types' })
  @ApiOkResponse({ description: 'All wash types returned' })
  @ApiNoContentResponse({ description: 'Could not find wash types' })
  async getAllWashTypes() {
    return await this.service.getAllWashTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wash type with specified ID' })
  @ApiOkResponse({ description: 'Wash type with specified ID returned' })
  @ApiBadRequestResponse({
    description: 'Failed to get wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Wash type not found' })
  async getWashType(@Param() params: NumberStringParam) {
    return await this.service.getWashType(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new wash type' })
  @ApiCreatedResponse({ description: 'Wash type created and returned' })
  @ApiBadRequestResponse({
    description: 'Failed to create wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Associated company not found' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  // strips properties which do not have decorators
  async createWashType(@Body() dto: CreateWashTypeDto) {
    return await this.service.createWashType(dto);
  }

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
  // strips properties which do not have decorators
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateWashType(
    @Param() params: NumberStringParam,
    @Body() dto: UpdateWashTypeDto,
  ) {
    return await this.service.updateWashType(params.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes wash type with specified ID' })
  @ApiOkResponse({ description: 'Wash type with specified ID deleted' })
  @ApiBadRequestResponse({
    description: 'Failed to delete wash type as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Wash type not found' })
  async deleteWashType(@Param() params: NumberStringParam) {
    await this.service.deleteWashType(params.id);
  }
}
