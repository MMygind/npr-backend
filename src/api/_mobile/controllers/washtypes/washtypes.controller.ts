import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { WashTypeService } from '../../../../core/services/washtype/washtype.service';
import { ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NumberStringParam } from '../../../utilities/numberstringparam';
import JwtAuthenticationGuard from '../../../../core/authentication/mobile/guards/jwt-auth.guard';
import RequestWithCustomer from '../../../../core/authentication/mobile/request-with-customer.interface';

@Controller('mobile/washtypes')
export class WashTypesController {
  constructor(private service: WashTypeService) {
  }

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
  async getLocationWashTypes(@Param() params: NumberStringParam, @Req() request: RequestWithCustomer) {
    const customer = request.user;
    return await this.service.getLocationWashTypes(
      params.id,
      customer.companyId,
    );
  }
}
