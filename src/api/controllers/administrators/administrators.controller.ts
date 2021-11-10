import { Controller } from '@nestjs/common';
import { AdministratorService } from '../../../core/services/administrator/administrator.service';

@Controller('administrators')
export class AdministratorsController {
  constructor(private service: AdministratorService) {}
}
