import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { PasswordsDto } from './passwords.dto';
import { NAME_REGEX, SLUG_REGEX } from 'src/common/consts/regex.const';

export abstract class SignUpDto extends PasswordsDto {
  @IsString()
  @Length(3, 100, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  @Matches(NAME_REGEX, {
    message: 'Name can only contain letters, dots, numbers and spaces.',
  })
  public name!: string;

  @IsString()
  @Length(3, 50, {
    message: 'Username hat to be between 3 and 50 character.',
  })
  @Matches(SLUG_REGEX, {
    message: 'Username is invalid.',
  })
  public username!: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;
}
