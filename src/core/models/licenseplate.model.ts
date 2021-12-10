import { CustomerModel } from './customer.model';

export interface LicensePlateModel {
  id?: number;
  customer: CustomerModel;
  licensePlate: string;
}
