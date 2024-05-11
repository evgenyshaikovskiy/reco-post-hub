import { IsBoolean, IsNumber, IsString } from "class-validator";
import { NotificationType } from "../notification.enum";
import { Column } from "typeorm";

export abstract class CreateNotificationDto {
  type: NotificationType;

  @IsString()
  text: string;

  @IsString()
  targetId: string;

  url?: string;

  @IsBoolean()
  viewed: boolean;
}