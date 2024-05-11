import { ISubscription } from "src/subscription/interfaces";
import { ICredentials } from "./credentials.interface";

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: ICredentials;
  subscriptions: ISubscription[];
  createdAt: Date;
  updatedAt: Date;
}