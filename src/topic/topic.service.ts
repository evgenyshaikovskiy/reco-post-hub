import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto, EditTopicDto } from './dtos';
import { CommonService } from 'src/common/common.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { ITopic } from './interfaces/topic.interface';
import {
  IPagination,
  PaginatedResource,
} from 'src/common/utils/pagination.util';
import { IFiltering } from 'src/common/utils/filter.util';
import { ISorting } from 'src/common/utils/sorting.util';
import { getOrder, getWhere } from 'src/common/utils/other.utils';
import { UserRole } from 'src/users/interfaces/user.interface';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/notification.enum';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicsRepository: Repository<TopicEntity>,
    private readonly commonService: CommonService,
    private readonly usersService: UserService,
    private readonly notificationService: NotificationService,
    private readonly hashtagsService: HashtagService,
  ) {}

  public async create(
    dto: CreateTopicDto,
    user: UserEntity,
  ): Promise<TopicEntity> {
    const { title, contentHtml, contentText, summarization, hashtags } = dto;
    const url = this.convertTitleToUrl(title);
    await this._checkUrlUniqueness(url);
    const topic = this.topicsRepository.create({
      author: user,
      hashtags: [],
      scores: [],
      comments: [],
      htmlContent: contentHtml,
      title: title,
      textContent: contentText,
      summarization,
      published: false,
      totalScore: 0,
      url,
    });
    const hashtagEntities =
      await this.hashtagsService.updateHashtagsOnTopicCreation(hashtags, topic);
    topic.hashtags = [...hashtagEntities];
    await this.commonService.saveEntity(this.topicsRepository, topic, true);
    return topic;
  }

  public async removeUnpublishedTopic(topicId: string): Promise<TopicEntity> {
    const topic = await this.topicsRepository.findOne({
      where: { topicId },
      relations: ['hashtags', 'hashtags.topics'],
    });

    if (!topic || topic.published) {
      throw new BadRequestException('Topic to remove was not found');
    }

    // unlink hashtags from topic
    // if hashtag is not linked with any topic it is removed
    await Promise.all(
      topic.hashtags.map((hs) =>
        this.hashtagsService.removeTopicFromHashtagEntity(hs.id, topicId),
      ),
    );

    topic.hashtags = [];
    await this.commonService.saveEntity(this.topicsRepository, topic, false);

    await this.topicsRepository.remove([topic]);
    return topic;
  }

  public async updateTopic(
    topicId: string,
    dto: EditTopicDto,
  ): Promise<TopicEntity> {
    const { published } = dto;
    const topic = await this.topicsRepository.findOne({
      where: { topicId },
      relations: ['author'],
    });
    if (!topic || topic.published) {
      throw new BadRequestException('Topic is not accessible to change');
    }

    topic.published = published;

    if (published) {
      // create notification for each subscriber
      await this.notificationService.create({
        targetId: topic.author.id,
        text: 'Your topic was published!',
        type: NotificationType.PUBLISHED,
        url: `topic/${topic.url}`,
        viewed: false,
      });
    }

    await this.commonService.saveEntity(this.topicsRepository, topic, false);
    return topic;
  }

  public async getTopicByUrl(url: string): Promise<TopicEntity> {
    const topic = await this.topicsRepository.findOne({
      where: { url },
      relations: [
        'author',
        'hashtags',
        'scores',
        'comments',
        'comments.author',
        'comments.childComments',
        'scores.actor',
        'scores.topic',
      ],
    });

    if (!topic) {
      throw new NotFoundException('Topic was not found!');
    }

    return { ...topic };
  }

  public async getTopicById(topicId: string): Promise<ITopic> {
    const topic = await this.topicsRepository.findOne({
      where: { topicId },
      relations: [
        'author',
        'hashtags',
        'scores',
        'comments',
        'comments.author',
      ],
    });
    if (!topic) {
      throw new NotFoundException('Topic was not found');
    }

    return {
      ...topic,
    };
  }

  public async getTopics(
    { page, limit, size, offset }: IPagination,
    sort?: ISorting,
    filter?: IFiltering[],
  ): Promise<PaginatedResource<ITopic>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [result, total] = await this.topicsRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
      relations: ['author', 'hashtags', 'scores'],
    });

    return { totalItems: total, items: result, page, size };
  }

  public async getTopicsWithHashtags(
    hashtags: string[],
  ): Promise<ITopic[]> {
    const allTopics = await this.topicsRepository.find({
      relations: ['author', 'hashtags'],
    });

    const topicWithHashtags = allTopics.filter((topic) =>
      topic.hashtags.map((hs) => hs.name).some((hs) => hashtags.includes(hs)),
    );

    return topicWithHashtags;
  }

  public async getTopicsWithAuthors(authors: string[]): Promise<ITopic[]> {
    const allTopics = await this.topicsRepository.find({
      relations: ['author', 'hashtags'],
    });

    const topicWithAuthor = allTopics.filter((topic) => authors.includes(topic.author.username));
    return topicWithAuthor;
  }

  public async getAllTopics(): Promise<TopicEntity[]> {
    return await this.topicsRepository.find({ relations: ['author', 'hashtags', 'scores'] });
  }

  public async updateTopics(topics: TopicEntity[]): Promise<TopicEntity[]> {
    return await this.topicsRepository.save(topics);
  }

  public async recalculateTopicScores(topicId: string): Promise<void> {
    const topic = await this.topicsRepository.findOne({
      where: { topicId },
      relations: ['scores'],
    });

    const totalOfScores = topic.scores
      .map((score) => +score.score)
      .reduce((acc, prev) => acc + prev, 0);
    const countOfScores = topic.scores.length;
    const average = totalOfScores / countOfScores;

    const currentTotal = topic.totalScore;

    if (currentTotal !== average) {
      topic.totalScore = average;
      return await this.commonService.saveEntity(this.topicsRepository, topic, false);
    }
  }

  // public async getNumberOfTopics(count: number): Promise<IPublicTopic[]> {
  //   const topics = await this.topicsRepository.find({
  //     relations: ['hashtags'],
  //   });
  //   const distinctTopicsAuthorsIds = [
  //     ...new Set(topics.map((topic) => topic.authorId)),
  //   ];
  //   const topicsAuthorsPromises = distinctTopicsAuthorsIds.map((distinctId) =>
  //     this.usersService.findOneById(distinctId),
  //   );
  //   const topicsAuthor = await Promise.all(topicsAuthorsPromises);
  //   const sortedTopics = topics.sort(
  //     (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  //   );

  //   return (sortedTopics.length <= count ? sortedTopics : sortedTopics)
  //     .slice(0, count)
  //     .map((topic) => {
  //       return {
  //         ...topic,
  //         user: topicsAuthor.find(
  //           (author) => String(topic.authorId) === String(author.id),
  //         ),
  //       };
  //     });
  // }

  private convertTitleToUrl(title: string) {
    // Replace any characters that are not letters or spaces with empty strings
    const sanitizedTitle = title.replace(/[^a-zA-Z\s]/g, '');

    // Split the sanitized title into individual words
    const words = sanitizedTitle.split(' ');

    // Convert each word to lowercase and join with dashes
    const url = words.map((word) => word.toLowerCase()).join('-');

    return url;
  }

  private async _checkUrlUniqueness(url: string): Promise<void> {
    const count = await this.topicsRepository.count({ where: { url } });
    if (count > 0) {
      throw new ConflictException('Invalid title, try another');
    }
  }
}
