import { IsJWT, IsString } from 'class-validator';

export abstract class RefreshTokenDto {
  @IsString()
  @IsJWT()
  public refreshToken!: string;
}