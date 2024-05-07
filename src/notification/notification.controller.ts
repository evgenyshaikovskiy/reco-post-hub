import { Controller, Get, Param, Patch, UseInterceptors } from "@nestjs/common";
import { AuthInterceptor } from "src/auth.interceptor";
import { NotificationService } from "./notification.service";
import { GetUser } from "src/user.decorator";
import { UserEntity } from "src/users/entities/user.entity";

@UseInterceptors(AuthInterceptor)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  public async getAllNotifications(@GetUser() user: UserEntity) {
    return await this.notificationService.getAllNotificationsForUser(user.id);
  }

  @Patch(':id')
  public async markAsViewed(@Param() params) {
    return await this.notificationService.markAsViewed(params.id);
  }
}