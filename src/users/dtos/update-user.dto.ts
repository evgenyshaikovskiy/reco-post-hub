import {
  IsBoolean,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { NAME_REGEX, SLUG_REGEX } from 'src/common/consts/regex.const';
import { isUndefined, isNull } from 'src/common/utils/validation.util';


export abstract class UpdateUserDto {
  @ValidateIf(
    (o: UpdateUserDto) => !isUndefined(o.username),
  )
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slugs',
  })
  public username?: string;

  
  @ValidateIf((o: UpdateUserDto) => !isUndefined(o.name))
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  public name?: string;

  @ValidateIf((o: UpdateUserDto) => !isUndefined(o.confirmed))
  @IsBoolean()
  public confirmed?: boolean;

  @ValidateIf((o: UpdateUserDto) => !isUndefined(o.userPictureId))
  @IsString()
  public userPictureId?: string;
}
