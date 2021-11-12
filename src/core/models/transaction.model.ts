import { WashTypeModel } from './washtype.model';
import { LocationModel } from './location.model';
import { LicenseplateModel } from './licenseplate.model';

export interface TransactionModel {
  id?: number;
  washType: WashTypeModel;
  location: LocationModel;
  licensePlate: LicenseplateModel;
  timestamp: Date;
  imageURL: string;
}
