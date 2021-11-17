import { CompanyModel } from '../../core/models/company.model';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  company: CompanyModel;

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
