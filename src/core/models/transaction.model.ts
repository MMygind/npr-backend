import { WashtypeModel } from './washtype.model';
import { LocationModel } from './location.model';
import { LicenseplateModel } from './licenseplate.model';

export interface TransactionModel {
  id?: number;
  washType: WashtypeModel;
  location: LocationModel;
  licensePlate: LicenseplateModel;
  timestamp: Date;
  imageURL: string;
}
