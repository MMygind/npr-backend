import { CompanyModel } from '../../core/models/company.model';
import { WashTypeModel } from '../../core/models/washtype.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateLocationDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNumber()
  @Min(1000)
  @Max(9999)
  @IsNotEmpty()
  @ApiProperty()
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  longitude?: number;
}
