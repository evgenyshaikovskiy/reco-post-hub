import { ITopic } from "src/topic/interfaces/topic.interface";
import { IUser } from "src/users/interfaces/user.interface";

export interface IComment {
  id: string;
  author: IUser
  topic: ITopic;
  textContent: string;
  htmlContent: string;
}