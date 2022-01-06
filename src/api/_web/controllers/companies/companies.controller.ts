import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CompanyService } from 'src/core/services/company/company.service';
import { NumberStringParam } from '../../../utilities/numberstringparam';
import JwtAuthenticationGuard from '../../../../core/authentication/web/guards/jwt-auth.guard';
import RequestWithCompany from '../../../../core/authentication/web/request-with-company.interface';

@Controller('web/companies')
export class CompaniesController {
  constructor(private service: CompanyService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get company with specified ID' })
  @ApiOkResponse({
    description: 'Company with specified ID returned',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get company as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async getCompany(@Param() params: NumberStringParam) {
    return await this.service.getCompany(params.id);
  }

  @Get('/thisCompany')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get company for authenticated company user' })
  @ApiOkResponse({
    description: 'Company for authenticated company user returned',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get company as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async getThisCompany(
    @Req() request: RequestWithCompany
  ) {
    const company = request.user;
    return await this.service.getCompanyWithLocationAndWashTypes(company.id);
  }
}
