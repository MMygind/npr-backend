import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from '../../../core/services/company/company.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NumberStringParam } from '../../utilities/numberstringparam';

@Controller('companies')
export class CompaniesController {
  constructor(private service: CompanyService) {}

  @Get()
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
  @ApiOperation({ summary: 'Get company for authenticated company user' })
  @ApiOkResponse({
    description: 'Company for authenticated company user returned',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get company as request was malformed',
  })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async getThisCompany() {
    const hardcodedCompanyID = 1;
    return await this.service.getCompanyWithLocationAndWashTypes(
      hardcodedCompanyID,
    );
  }
}
