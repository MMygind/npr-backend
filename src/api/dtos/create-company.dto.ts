import { SubscriptionModel } from "src/core/models/subscription.model";

export class CreateCompanyDto {
    email: string;
    name: string;
    password: string;
    phoneNumber: string;
    subscriptionId: SubscriptionModel;
    active: boolean;
  }
  
  export default CreateCompanyDto;