import { Controller, Get } from '@nestjs/common';
import { FilteringParams, IFiltering } from 'src/common/utils/filter.util';
import {
  IPagination,
  PaginationParams,
} from 'src/common/utils/pagination.util';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagPublicController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get('')
  public async getHashtags(
    @PaginationParams() paginationParams: IPagination,
    @FilteringParams(['name']) filteringParams?: IFiltering[],
  ) {
    return await this.hashtagService.getHashtagsPaginated(
      paginationParams,
      filteringParams,
    );
  }

  @Get('all')
  public async getAllHashtag() {
    return await this.hashtagService.getHashtags();
  }
}
