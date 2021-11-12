import { SubscriptionModel } from './subscription.model';
import { LicenseplateModel } from './licenseplate.model';

export interface CustomerModel {
  id?: number;
  name: string;
  email: string;
  creationDate: Date;
  phoneNumber: string;
  subscription: SubscriptionModel;
  licensePlates: LicenseplateModel[];
  active: boolean;
}
