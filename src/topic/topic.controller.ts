import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dtos';
// import { AuthGuard } from '@nestjs/passport';
// import { GetUser } from 'src/auth/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthInterceptor } from 'src/auth.interceptor';
import { GetUser } from 'src/user.decorator';
// import { AuthGuard } from 'src/auth.guard';

// @UseGuards(AuthGuard('jwt'))
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
}
