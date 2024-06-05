import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagSimilarityEntity } from './entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';

@Injectable()
export class HashtagSimilarityService {
  constructor(
    @InjectRepository(HashtagSimilarityEntity)
    private readonly repository: Repository<HashtagSimilarityEntity>,
    private readonly commonService: CommonService,
    private readonly hashtagService: HashtagService,
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
}
