import { SubscriptionModel } from './subscription.model';

export interface CustomerModel {
  id?: number;
  email: string;
  creationDate: Date;
  phoneNumber: string;
  subscription: SubscriptionModel;
}
