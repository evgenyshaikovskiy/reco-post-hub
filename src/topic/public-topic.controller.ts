import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthOptionalInterceptor } from 'src/auth-optional.interceptor';
import {
  IPagination,
  PaginationParams,
} from 'src/common/utils/pagination.util';
import { ISorting, SortingParams } from 'src/common/utils/sorting.util';
import { FilteringParams, IFiltering } from 'src/common/utils/filter.util';
import { EventService } from 'src/event/event.service';
import { EventType } from 'src/event/interfaces';

@Controller('topic')
export class TopicPublicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly eventService: EventService,
  ) {}

  @UseInterceptors(AuthOptionalInterceptor)
  @Get(':url')
  public async getTopic(@Param() params, @GetUser() user: UserEntity) {
    const entity = await this.topicService.getTopicByUrl(params.url);
    await this.eventService.create({
      emitterId: user ? user.id : '',
      receiverId: entity.topicId,
      type: user ? EventType.VIEW_TOPIC : EventType.VIEW_TOPIC_UNAUTHORIZED,
    });

    return entity;
  }

  @Get('')
  public async getTopics(
    @PaginationParams() paginationParams: IPagination,
    @SortingParams(['createdAt', 'title', 'totalScore'])
    sortingParams?: ISorting,
    @FilteringParams([
      'createdAt',
      'title',
      'summarization',
      'textContent',
      'published',
      'totalScore',
    ])
    filteringParams?: IFiltering[],
  ) {
    return await this.topicService.getTopics(
      paginationParams,
      sortingParams,
      filteringParams,
    );
  }

  @Get('hashtags/:hashtags')
  public async getTopicsWithHashtags(@Param() params: { hashtags: string }) {
    return await this.topicService.getTopicsWithHashtags(
      params.hashtags.split('&'),
    );
  }

  @Get('author/:authors')
  public async getTopicsWithAuthors(@Param() params: { authors: string }) {
    return await this.topicService.getTopicsWithAuthors(
      params.authors.split('&'),
    );
  }
}
