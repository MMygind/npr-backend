import { Request } from 'express';
import { CompanyEntity } from 'src/infrastructure/entities/company.entity';
 
interface RequestWithCompany extends Request {
  company: CompanyEntity;
}
 
export default RequestWithCompany;