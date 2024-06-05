import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateAnswerDto, CreateCommentDto } from './dto/create.dto';
import { TopicService } from 'src/topic/topic.service';
import { UserService } from 'src/users/users.service';
import { CommonService } from 'src/common/common.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { NotificationType } from 'src/notification/notification.enum';
import { EditCommentDto } from './dto/edit.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly topicService: TopicService,
    private readonly commonService: CommonService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  public async create(
    dto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const { topicId, textContent, htmlContent } = dto;

    const publicTopic = await this.topicService.getTopicById(topicId);

    const comment = this.commentRepository.create({
      author: user,
      topic: publicTopic,
      htmlContent: htmlContent,
      textContent: textContent,
    });

    await this.commonService.saveEntity(this.commentRepository, comment, true);

    const notifications = [
      // create notification for topic author
      this.notificationService.create({
        targetId: publicTopic.author.id,
        text: `There is new comment under your topic from ${user.username}`,
        url: `topic/${publicTopic.url}`,
        viewed: false,
        type: NotificationType.COMMENT,
      }),
    ];

    await Promise.all(notifications);

    return comment;
  }

  public async createAnswer(
    dto: CreateAnswerDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const { topicId, textContent, htmlContent, parentCommentId } = dto;
    const publicTopic = await this.topicService.getTopicById(topicId);
    const parentComment = await this.commentRepository.findOne({
      where: { id: parentCommentId },
      relations: ['author', 'topic'],
    });

    if (!parentComment) {
      throw new NotFoundException('No comment to reply');
    }

    const comment = this.commentRepository.create({
      author: user,
      topic: publicTopic,
      htmlContent: htmlContent,
      textContent: textContent,
      parentComment: parentComment,
    });

    await this.commonService.saveEntity(this.commentRepository, comment, true);

    const notifications = [];

    if (parentComment.author.id !== comment.author.id) {
      notifications.push(
        this.notificationService.create({
          targetId: parentComment.author.id,
          text: `${user.username} answered to your comment`,
          url: `topic/${publicTopic.url}`,
          viewed: false,
          type: NotificationType.COMMENT_ANSWERED,
        }),
      );
    }

    if (notifications.length > 0) {
      await Promise.all(notifications);
    }

    return comment;
  }

  public async update(
    commentId: string,
    dto: EditCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const comment = await this.findOneById(commentId);
    const { textContent, htmlContent } = dto;

    if (htmlContent === comment.htmlContent) {
      throw new BadRequestException('Comment contents must be different!');
    }

    comment.textContent = textContent;
    comment.htmlContent = htmlContent;

    await this.commonService.saveEntity(this.commentRepository, comment);

    return comment;
  }

  public async findOneById(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'topic'],
    });
    this.commonService.checkEntityExistence(comment, 'Comment');
    return comment;
  }

  public async getCommentFromTopic(topicId: string): Promise<CommentEntity[]> {
    const treeRepo = this.dataSource.getTreeRepository(CommentEntity);
    const topLevelComments = await this.commentRepository.find({
      where: {
        topic: { topicId },
        parentComment: IsNull(),
      },
      relations: ['author'],
    });

    const comments = await Promise.all(
      topLevelComments.map((comment) =>
        treeRepo.findDescendantsTree(comment, { relations: ['author'] }),
      ),
    );

    return comments;
  }
}
