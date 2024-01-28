import { IUser } from 'src/users/interfaces/user.interface';

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
