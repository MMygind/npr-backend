import { IsNumberString } from 'class-validator';

export class NumberStringParam {
  @IsNumberString()
  id: number; // number in official docs but shouldn't it be string?
}
