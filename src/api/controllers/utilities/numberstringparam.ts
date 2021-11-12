import { IsNumberString } from 'class-validator';

export class NumberStringParam {
  @IsNumberString()
  id: number;
}
