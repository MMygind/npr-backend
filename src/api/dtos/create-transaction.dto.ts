import { WashTypeModel } from '../../core/models/washtype.model';
import { LocationModel } from '../../core/models/location.model';
import { LicensePlateModel } from '../../core/models/licenseplate.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  washType: WashTypeModel;

  @IsNotEmpty()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  location: LocationModel;

  @IsOptional()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  licensePlate?: LicensePlateModel;
}
