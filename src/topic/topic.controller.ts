import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto, EditTopicDto } from './dtos';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthInterceptor } from 'src/auth.interceptor';
import { GetUser } from 'src/user.decorator';
import {
  IPagination,
  PaginationParams,
} from 'src/common/utils/pagination.util';
import { UserRole } from 'src/users/interfaces/user.interface';

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

  @Delete(':id')
  public async removeTopic(@Param() params, @GetUser() user: UserEntity) {
    if (!(user.role === UserRole.ADMIN || user.role === UserRole.MOD)) {
      throw new BadRequestException(
        'You are not authorized to remove this topic',
      );
    }

    return await this.topicService.removeUnpublishedTopic(params.id);
  }

  @Patch(':id')
  public async updateTopic(
    @Param() params: { id: string },
    @Body() updateTopicDto: EditTopicDto,
    @GetUser() user: UserEntity,
  ) {
    if (!(user.role === UserRole.ADMIN || user.role === UserRole.MOD)) {
      throw new BadRequestException(
        'You are not authorized to edit this topic',
      );
    }

    return this.topicService.updateTopic(params.id, updateTopicDto);
  }
}
