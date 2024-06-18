import { Body, Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from 'src/user.decorator';

@UseInterceptors(AuthInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  public async updateUser(
    @Body() dto: UpdateUserDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.userService.update(user.id, dto);
  }

  @Get()
  public async currentUser(@GetUser() user: UserEntity) {
    console.log(user);
    return user;
  }
}
