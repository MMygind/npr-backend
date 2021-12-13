import { Request } from 'express';
import { CompanyEntity } from 'src/infrastructure/entities/company.entity';
 
interface RequestWithCompany extends Request {
  user: CompanyEntity;
}
 
export default RequestWithCompany;