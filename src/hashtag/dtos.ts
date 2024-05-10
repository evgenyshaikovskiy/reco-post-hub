import { IsString } from 'class-validator';

export abstract class CreateHashtagDto {
  @IsString()
  name: string;
}
