import { SubscriptionModel } from '../../../core/models/subscription.model';
import { LicensePlateModel } from '../../../core/models/licenseplate.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  creationDate: Date;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  subscription: SubscriptionModel;
  @ApiProperty()
  licensePlates: LicensePlateModel[];
  @ApiProperty()
  active: boolean;
}
