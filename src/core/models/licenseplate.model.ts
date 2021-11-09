import { CustomerModel } from './customer.model';

export interface LicenseplateModel {
  id?: number;
  customer: CustomerModel;
  licensePlate: string;
}
