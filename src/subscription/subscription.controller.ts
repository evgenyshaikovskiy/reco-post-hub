import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthInterceptor } from 'src/auth.interceptor';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateSubscriptionDto } from './interfaces';
import { EventService } from 'src/event/event.service';

@UseInterceptors(AuthInterceptor)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Post('')
  public async addSubscription(
    @Body() dto: CreateSubscriptionDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.create(dto, user);
  }

  @Delete(':id')
  public async unsubscribe(@Param() params, @GetUser() user: UserEntity) {
    return await this.service.deleteSubscriptionById(params.id);
  }

  @Get('hashtags')
  public async getHashtagSubscriptions(@GetUser() user: UserEntity) {
    return await this.service.getHashtagsSubscriptions(user);
  }

  @Get('users')
  public async getUserSubscriptions(@GetUser() user: UserEntity) {
    return await this.service.getUsersSubscriptions(user);
  }

  @Get('')
  public async getAllSubscriptions(@GetUser() user: UserEntity) {
    return await this.service.getHashtagsSubscriptions(user);
  }
}
