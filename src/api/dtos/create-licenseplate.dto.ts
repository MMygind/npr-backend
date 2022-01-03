import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerModel } from '../../core/models/customer.model';

export class CreateLicensePlateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^[A-Z]{2}[0-9]{5}$/)
  licensePlate: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  customer: CustomerModel;
}
