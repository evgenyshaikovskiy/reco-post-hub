import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagSimilarityEntity } from './entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class HashtagSimilarityService {
  constructor(
    @InjectRepository(HashtagSimilarityEntity)
    private readonly repository: Repository<HashtagSimilarityEntity>,
    private readonly commonService: CommonService,
    private readonly hashtagService: HashtagService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public async add(
    hashtagEntity: HashtagEntity,
    similarityArray: string[],
  ): Promise<HashtagSimilarityEntity> {
    const presented = await this.repository.findOne({
      where: {
        hashtag: hashtagEntity,
      },
      relations: ['hashtag'],
    });

    if (presented) {
      // update
      presented.otherHashtags = similarityArray;
      await this.commonService.saveEntity(this.repository, presented, false);
      return presented;
    } else {
      const newEntity = this.repository.create({
        hashtag: hashtagEntity,
        otherHashtags: similarityArray,
      });

      await this.commonService.saveEntity(this.repository, newEntity, true);
      return newEntity;
    }
  }

  public async getHashtagRecommendations(
    hashtagId: string,
  ): Promise<HashtagEntity[]> {
    const similarityEntity = await this.repository.findOne({
      where: { hashtag: { id: hashtagId } },
      relations: ['hashtag'],
    });

    if (!similarityEntity) {
      throw new NotFoundException(
        'Could not receive recommendations for hashtag, try later',
      );
    }

    const name_metrics = similarityEntity.otherHashtags.map((name_metric) => ({
      name: name_metric.split(':').at(0),
      metric: +name_metric.split(':').at(1),
    }));

    name_metrics.sort((a, b) => b.metric - a.metric);
    console.log(name_metrics);

    const hashtags = await Promise.all(
      name_metrics
        .slice(0, 5)
        .map((a) => this.hashtagService.getHashtagByName(a.name)),
    );
    return hashtags;
  }

  public async getPersonalizedRecommendations(
    user: UserEntity,
  ): Promise<HashtagEntity[]> {
    const userSubscriptionsHashtagsIds = (
      await this.subscriptionService.getHashtagsSubscriptions(user)
    ).map((sub) => sub.targetId);

    const maxIdx = userSubscriptionsHashtagsIds.length - 1;
    const hashtagIdx = Math.floor(Math.random() * (maxIdx  + 1));
    const randomHashtagId = userSubscriptionsHashtagsIds[hashtagIdx]; 

    const similarityEntity = await this.repository.findOne({
      where: { hashtag: { id: randomHashtagId } },
      relations: ['hashtag'],
    });

    if (!similarityEntity) {
      throw new NotFoundException(
        'Could not receive recommendations for hashtag, try later',
      );
    }

    const name_metrics = similarityEntity.otherHashtags.map((name_metric) => ({
      name: name_metric.split(':').at(0),
      metric: +name_metric.split(':').at(1),
    }));

    name_metrics.sort((a, b) => b.metric - a.metric);
    const hashtags = await Promise.all(
      name_metrics.map((a) => this.hashtagService.getHashtagByName(a.name)),
    );

    return hashtags
      .filter((hs) => !userSubscriptionsHashtagsIds.includes(hs.id))
      .slice(0, 5);
  }
}
