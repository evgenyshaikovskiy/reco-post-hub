import { NotificationType } from "./notification.enum";

export class INotification {
  id: string;
  type: NotificationType;
  text: string;
  targetId: string;
  url?: string;
  viewed: boolean;
}