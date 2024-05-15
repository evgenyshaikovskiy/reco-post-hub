import { IUser } from "src/users/interfaces/user.interface";
import { NotificationType } from "./notification.enum";

export class INotification {
  id: string;
  type: NotificationType;
  text: string;
  receiver: IUser;
  url?: string;
  viewed: boolean;
}