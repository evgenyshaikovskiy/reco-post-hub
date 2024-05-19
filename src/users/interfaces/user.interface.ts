import { ISubscription } from 'src/subscription/interfaces';
import { ICredentials } from './credentials.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IScore } from 'src/score/score.interface';
import { ISettings } from './settings.interface';
import { INotification } from 'src/notification/interfaces';
import { IBookmark } from 'src/bookmark/bookmark.interface';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  bio: string;
  karma: number;
  rating: number;
  credentials: ICredentials;
  settings: ISettings;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;

  notifications: INotification[];
  subscriptions: ISubscription[];
  bookmarks: IBookmark[];
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
