import { NotificationType } from "./notification.enum";

export class INotification {
  id: string;
  type: NotificationType;
  text: string;
  targetId: number;
  url?: string;
  viewed: boolean;
}