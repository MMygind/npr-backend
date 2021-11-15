import { CompanyModel } from '../../core/models/company.model';
import { WashTypeModel } from '../../core/models/washtype.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class EditLocationDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

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

  @IsArray()
  @ApiProperty({ description: 'Must have positive integer property "id"' })
  washTypes: WashTypeModel[];
}
