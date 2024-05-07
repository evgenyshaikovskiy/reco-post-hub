import { IsBoolean, IsNumber, IsString } from "class-validator";
import { NotificationType } from "../notification.enum";
import { Column } from "typeorm";

export abstract class CreateNotificationDto {
  type: NotificationType;

  @IsString()
  text: string;

  @IsNumber()
  targetId: number;

  url?: string;

  @IsBoolean()
  viewed: boolean;
}