import { ISubscription } from 'src/subscription/interfaces';
import { ICredentials } from './credentials.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IScore } from 'src/score/score.interface';
import { ISettings } from './settings.interface';
import { INotification } from 'src/notification/interfaces';
import { IBookmark } from 'src/bookmark/bookmark.interface';
import { IComment } from 'src/comment/interfaces';

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
  comments: IComment[];
}

export enum UserRole {
  ADMIN = 'admin',
  MOD = 'mod',
  USER = 'user',
}

/**
 *   showBio: boolean;
  showEmail: boolean;
  showUserSubscriptions: boolean;
  showHashtagSubscriptions: boolean;
  showComments: boolean;
  showKarma: boolean;
  showRating: boolean;
  showScores: boolean;
 */

export interface IUserProfile {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userPictureId: string;
  
  bio?: string;
  email?: string;
  subscriptions?: ISubscription[];
  hashtagSubscriptions?: ISubscription[];
  comments?: IComment[];
  

  karma?: number;
  rating?: number;
}
