import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserProfile } from './interfaces/user.interface';

@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UsersService) {}

  @Get(':username')
  public async getUserProfile(@Param() params): Promise<IUserProfile> {
    return await this.userService.findProfileByUsername(params.username);
  }
}
