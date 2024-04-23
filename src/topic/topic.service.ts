import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto } from './dtos';
import { CommonService } from 'src/common/common.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { IPublicTopic } from './topic.interface';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicsRepository: Repository<TopicEntity>,
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
  ) {}

  public async create(
    dto: CreateTopicDto,
    user: UserEntity,
  ): Promise<TopicEntity> {
    const { title, contentHtml, contentText, summarization, hashtags } = dto;
    const url = this.convertTitleToUrl(title);

    await this._checkUrlUniqueness(url);

    const topic = this.topicsRepository.create({
      authorId: user.id,
      hashtags: hashtags,
      htmlContent: contentHtml,
      title: title,
      textContent: contentText,
      summarization,
      url,
    });

    await this.commonService.saveEntity(this.topicsRepository, topic, true);
    return topic;
  }

  public async getTopicByUrl(url: string): Promise<IPublicTopic> {
    const topic = await this.topicsRepository.findOne({ where: { url } });
    const author = await this.usersService.findOneById(topic.authorId);
    if (!topic) {
      throw new NotFoundException('Topic was not found!');
    }

    return { ...topic, user: author };
  }

  public async getNumberOfTopics(count: number): Promise<IPublicTopic[]> {
    const topics = await this.topicsRepository.find({});
    const distinctTopicsAuthorsIds = [
      ...new Set(topics.map((topic) => topic.authorId)),
    ];
    const topicsAuthorsPromises = distinctTopicsAuthorsIds.map((distinctId) =>
      this.usersService.findOneById(distinctId),
    );
    const topicsAuthor = await Promise.all(topicsAuthorsPromises);
    const sortedTopics = topics.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return (sortedTopics.length <= count ? sortedTopics : sortedTopics)
      .slice(0, count)
      .map((topic) => {
        return {
          ...topic,
          user: topicsAuthor.find(
            (author) => String(topic.authorId) === String(author.id),
          ),
        };
      });
  }

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
