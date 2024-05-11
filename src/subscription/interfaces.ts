import { IUser } from 'src/users/interfaces/user.interface';

export interface ISubscription {
  id: string;
  actor: IUser;
  type: SubscriptionType;
  // either user id or hashtag id
  targetId: string;
}

export enum SubscriptionType {
  TO_USER = 'to-user',
  TO_HASHTAG = 'to-hashtag',
}


export abstract class CreateSubscriptionDto {
  type: SubscriptionType;
  targetId: string;
}