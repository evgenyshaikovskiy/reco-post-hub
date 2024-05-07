import { Body, Controller, Patch, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
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

    return this.userService.update(user.id, dto);
  }
}
