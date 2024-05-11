import { ISubscription } from 'src/subscription/interfaces';
import { ICredentials } from './credentials.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: ICredentials;
  createdAt: Date;
  updatedAt: Date;

  // relationships
  subscriptions: ISubscription[];
  topics: ITopic[];
}
