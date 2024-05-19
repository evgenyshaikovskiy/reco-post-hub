import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dtos';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthInterceptor } from 'src/auth.interceptor';
import { GetUser } from 'src/user.decorator';
import { IPagination, PaginationParams } from 'src/common/utils/pagination.util';

@UseInterceptors(AuthInterceptor)
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  public async createTopic(
    @Body() dto: CreateTopicDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.topicService.create(dto, user);
  }

  @Get('review/all')
  public async getTopicsForReview(@PaginationParams() pagination: IPagination, @GetUser() user) {
    return await this.topicService.getTopicsForReview(pagination, user);
  }
}
