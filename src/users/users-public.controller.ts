import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { IUserProfile } from './interfaces/user.interface';

@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  public async getUserProfile(@Param() params): Promise<IUserProfile> {
    return await this.userService.findProfileByUsername(params.username);
  }
}
