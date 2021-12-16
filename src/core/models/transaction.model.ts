import { WashTypeModel } from './washtype.model';
import { LocationModel } from './location.model';
import { LicensePlateModel } from './licenseplate.model';
import { CustomerModel } from './customer.model';

export interface TransactionModel {
  id?: number;
  washType: WashTypeModel;
  location: LocationModel;
  licensePlate?: LicensePlateModel;
  customer: CustomerModel;
  purchasePrice: number;
  timestamp: Date;
  imageURL?: string;
}
