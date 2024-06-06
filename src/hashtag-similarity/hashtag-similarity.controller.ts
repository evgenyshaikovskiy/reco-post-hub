import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { HashtagSimilarityService } from './hashtag-similarity.service';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthInterceptor } from 'src/auth.interceptor';

@Controller('recommended-hashtags')
export class RecommendedHashtagsController {
  constructor(
    private readonly hashtagSimilarityService: HashtagSimilarityService,
  ) {}

  @UseInterceptors(AuthInterceptor)
  @Get('')
  public async getSimilarHashtagsPersonalized(@GetUser() user: UserEntity) {
    return await this.hashtagSimilarityService.getPersonalizedRecommendations(
      user,
    );
  }

  @Get(':hashtagId')
  public async getSimilarHashtags(@Param() params) {
    return await this.hashtagSimilarityService.getHashtagRecommendations(
      params.hashtagId,
    );
  }
}
