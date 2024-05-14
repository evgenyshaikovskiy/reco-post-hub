import { ISubscription } from 'src/subscription/interfaces';
import { ICredentials } from './credentials.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IScore } from 'src/score/score.interface';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: ICredentials;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;

  // relationships
  subscriptions: ISubscription[];
  topics: ITopic[];
  scores: IScore[];
}

export enum UserRole {
  ADMIN = 'admin',
  MOD = 'mod',
  USER = 'user',
}

export interface IUserProfile
  extends Omit<IUser, 'password' | 'confirmed' | 'credentials'> {}
