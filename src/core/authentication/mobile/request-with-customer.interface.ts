import { Request } from 'express';
import { CustomerEntity } from 'src/infrastructure/entities/customer.entity';
 
interface RequestWithCustomer extends Request {
  user: CustomerEntity;
}
 
export default RequestWithCustomer;