import { Controller } from '@nestjs/common';
import { CompanyService } from '../../../core/services/company/company.service';

@Controller('companies')
export class CompaniesController {
  constructor(private service: CompanyService) {}
}
