import { IUser } from 'src/users/interfaces/user.interface';

export interface IAuthResult {
  user: IUser;
  accessToken: TokenMetadata;
  refreshToken: TokenMetadata;
}

export interface TokenMetadata {
  token: string;
  expiredAt: number;
}
