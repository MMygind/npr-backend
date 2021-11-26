import { SubscriptionModel } from './subscription.model';
import { LicensePlateModel } from './licenseplate.model';

export interface CustomerModel {
  id?: number;
  name: string;
  email: string;
  creationDate: Date;
  phoneNumber: string;
  subscription: SubscriptionModel;
  licensePlates: LicensePlateModel[];
  active: boolean;
}
