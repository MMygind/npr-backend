import { WashTypeModel } from './washtype.model';
import { LocationModel } from './location.model';
import { LicensePlateModel } from './licenseplate.model';

export interface TransactionModel {
  id?: number;
  washType: WashTypeModel;
  location: LocationModel;
  licensePlate: LicensePlateModel;
  timestamp: Date;
  imageURL: string;
}
