import { CustomerModel } from './customer.model';

export interface AccountModel {
  id?: number;
  balance: number;
  customer: CustomerModel;
}
