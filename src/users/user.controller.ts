import { Body, Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import {
  UpdateUserDto,
  UpdateUserPrivacySettingsDto,
} from './dtos/update-user.dto';
import { GetUser } from 'src/user.decorator';

@UseInterceptors(AuthInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Patch()
  public async updateUser(
    @Body() dto: UpdateUserDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.userService.update(user.id, dto);
  }

  @Get()
  public async currentUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Patch('/privacy-settings')
  public async updatePrivacySettings(
    @GetUser() user: UserEntity,
    dto: UpdateUserPrivacySettingsDto,
  ) {
    return await this.userService.updateUserSettings(user.id, dto);
  }
}
