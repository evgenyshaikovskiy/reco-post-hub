import { IsString, Length, Matches, IsEmail } from 'class-validator';
import { NAME_REGEX } from 'src/common/consts/regex.const';

export abstract class SignInDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;

  @IsString()
  @Length(8, 35)
  public password!: string;
}
