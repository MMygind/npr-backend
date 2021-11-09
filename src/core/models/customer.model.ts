import { SubscriptionModel } from './subscription.model';

export interface CustomerModel {
  id?: number;
  name: string;
  email: string;
  creationDate: Date;
  phoneNumber: string;
  subscription: SubscriptionModel;
}
