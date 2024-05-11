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

@Controller('topic')
export class TopicPublicController {
  constructor(private readonly topicService: TopicService) {}

  @UseInterceptors(AuthOptionalInterceptor)
  @Get(':url')
  public async getTopic(@Param() params, @GetUser() user: UserEntity) {
    // if user
    const entity = await this.topicService.getTopicByUrl(params.url);
    return entity;
  }

  @Get('')
  public async getTopics(
    @PaginationParams() paginationParams: IPagination,
    @SortingParams(['createdAt', 'title', 'summarization'])
    sortingParams?: ISorting,
    @FilteringParams(['createdAt', 'title', 'summarization'])
    filteringParams?: IFiltering,
  ) {
    console.log(paginationParams, sortingParams, filteringParams);
    return await this.topicService.getTopics(paginationParams, sortingParams, filteringParams);
  }
}
