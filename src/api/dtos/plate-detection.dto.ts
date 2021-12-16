import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class PlateDetectionDto {
  @IsString()
  @ApiProperty()
  licensePlateNumber: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  locationID: number;
}
