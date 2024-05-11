import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagEntity } from './hashtag.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { CreateHashtagDto } from './dtos';
import { TopicEntity } from 'src/topic/topic.entity';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(HashtagEntity)
    private readonly repository: Repository<HashtagEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(
    dto: CreateHashtagDto,
    topic: TopicEntity,
  ): Promise<HashtagEntity> {
    const { name } = dto;

    await this._checkHashtagNameUniqueness(name);

    const hashtag = this.repository.create({
      name,
      topics: [{ ...topic }],
    });

    await this.commonService.saveEntity(this.repository, hashtag, true);
    return hashtag;
  }

  public async updateHashtagsOnTopicCreation(
    names: string[],
    topicCreated: TopicEntity,
  ): Promise<HashtagEntity[]> {
    const distinctNames = [
      ...new Set(names.map((name) => name.toLocaleLowerCase())),
    ];

    const existHashtagMappingPending = distinctNames.map((name) =>
      this._checkHashtagExistence(name).then((exists) => ({ exists, name })),
    );

    const existHashtagMapping = await Promise.all(existHashtagMappingPending);
    const hashtagsPending = existHashtagMapping.map((mappingObject) =>
      mappingObject.exists
        ? this.updateHashtag(mappingObject.name, topicCreated)
        : this.create({ name: mappingObject.name }, topicCreated),
    );

    const hashtags = await Promise.all(hashtagsPending);
    return hashtags;
  }

  public async updateHashtag(
    name: string,
    topic: TopicEntity,
  ): Promise<HashtagEntity> {
    const hashtag = await this.repository.findOne({
      where: { name: name.toLocaleLowerCase() },
      relations: ['topics'],
    });

    if (!hashtag) {
      throw new NotFoundException('Hashtag not found.');
    }

    hashtag.topics.push({ ...topic });
    await this.commonService.saveEntity(this.repository, hashtag, false);
    return hashtag;
  }

  private async _checkHashtagNameUniqueness(name: string): Promise<void> {
    const exists = await this._checkHashtagExistence(name);

    if (exists) {
      throw new ConflictException('Hashtag already presented in the database.');
    }
  }

  private async _checkHashtagExistence(name: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { name: name.toLocaleLowerCase() },
    });

    return count > 0;
  }
}
