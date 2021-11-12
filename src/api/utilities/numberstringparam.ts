import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NumberStringParam {
  @IsNumberString()
  @ApiProperty()
  id: number; // number in official docs but shouldn't it be string?
}
