import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { TopicService } from 'src/topic/topic.service';
import { CreateBookmarkDto, IBookmark } from './bookmark.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  IPagination,
  PaginatedResource,
} from 'src/common/utils/pagination.util';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly repository: Repository<BookmarkEntity>,
    private readonly commonService: CommonService,
    private readonly userService: UsersService,
    private readonly topicService: TopicService,
  ) {}

  public async create(
    { topicId }: CreateBookmarkDto,
    user: UserEntity,
  ): Promise<BookmarkEntity> {
    await this._checkBookmarkUniqueness(topicId, user.id);
    const topic = await this.topicService.getTopicById(topicId);

    if (!topic) {
      throw new BadRequestException(`Topic doesn't exist!`);
    }

    const entity = this.repository.create({
      user,
      topic,
    });

    await this.commonService.saveEntity(this.repository, entity, true);
    return entity;
  }

  public async removeBookmark(id: string): Promise<BookmarkEntity> {
    const bookmark = await this.repository.findOne({ where: { id } });
    if (!bookmark) {
      throw new NotFoundException(`Bookmark doesn't exist`);
    }

    await this.commonService.removeEntity(this.repository, bookmark);
    return bookmark;
  }

  public async getUserBookmarks(
    { page, limit, size, offset }: IPagination,
    user: UserEntity,
  ): Promise<PaginatedResource<IBookmark>> {
    const [result, total] = await this.repository.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      take: limit,
      skip: offset,
      relations: ['topic', 'user'],
    });

    return {
      totalItems: total,
      items: result,
      page,
      size,
    };
  }

  private async _checkBookmarkUniqueness(topicId: string, userId: string) {
    const count = await this.repository.count({
      where: {
        topic: {
          topicId: topicId,
        },
        user: {
          id: userId,
        },
      },
    });

    if (count > 0) {
      throw new ConflictException('Bookmark already exists');
    }
  }
}
