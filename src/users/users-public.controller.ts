import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UsersService) {}
}
