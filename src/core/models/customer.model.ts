import { SubscriptionModel } from './subscription.model';
import { LicensePlateModel } from './licenseplate.model';
import { CompanyModel } from "./company.model";

export interface CustomerModel {
  id?: number;
  name: string;
  email: string;
  creationDate: Date;
  phoneNumber: string;
  subscription: SubscriptionModel;
  licensePlates: LicensePlateModel[];
  company: CompanyModel;
  active: boolean;
}
