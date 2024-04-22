import { IsString, MaxLength } from 'class-validator';

export class CorrectGrammarDto {
  @IsString()
  @MaxLength(100)
  text: string;
}
