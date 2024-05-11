import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDto, CreateCommentDto } from './dto/create.dto';
import { TopicService } from 'src/topic/topic.service';
import { UsersService } from 'src/users/users.service';
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
  ) {}

  public async create(
    dto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const { authorId, topicId, textContent, htmlContent, mentionedProfileIds } =
      dto;

    const publicTopic = await this.topicService.getTopicById(topicId);

    const comment = this.commentRepository.create({
      authorId: authorId,
      topicId: topicId,
      htmlContent: htmlContent,
      textContent: textContent,
      mentionedProfileIds: mentionedProfileIds,
    });

    await this.commonService.saveEntity(this.commentRepository, comment, true);

    const notifications = [
      // create notification for topic author
      this.notificationService.create({
        targetId: publicTopic.author.id,
        text: `There is new comment under your topic from ${user.username}`,
        url: publicTopic.url,
        viewed: false,
        type: NotificationType.COMMENT,
      }),

      // create notification for each mention
      ...mentionedProfileIds.map((id) =>
        this.notificationService.create({
          targetId: id,
          text: `You have been mentioned by ${user.username} in comment section`,
          url: publicTopic.url,
          viewed: false,
          type: NotificationType.MENTION,
        }),
      ),
    ];

    await Promise.all(notifications);

    return comment;
  }

  public async createAnswer(
    dto: CreateAnswerDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const {
      authorId,
      topicId,
      textContent,
      htmlContent,
      mentionedProfileIds,
      parentCommentId,
    } = dto;
    const publicTopic = await this.topicService.getTopicById(topicId);
    const parentComment = await this.commentRepository.findOne({
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      throw new NotFoundException('No comment to reply');
    }

    const comment = this.commentRepository.create({
      authorId: authorId,
      topicId: topicId,
      htmlContent: htmlContent,
      textContent: textContent,
      mentionedProfileIds: mentionedProfileIds,
      parentComment: parentComment,
    });

    await this.commonService.saveEntity(this.commentRepository, comment, true);

    const notifications = [
      ...mentionedProfileIds.map((id) =>
        this.notificationService.create({
          targetId: id,
          text: `You have been mentioned by ${user.username} in comment section`,
          url: publicTopic.url,
          viewed: false,
          type: NotificationType.MENTION,
        }),
      ),
    ];

    if (parentComment.authorId !== comment.authorId) {
      notifications.push(
        this.notificationService.create({
          targetId: parentComment.authorId,
          text: `${user.username} just answered to your comment`,
          url: publicTopic.url,
          viewed: false,
          type: NotificationType.MENTION,
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
    const { textContent, htmlContent, mentionedProfileIds } = dto;
    const publicTopic = await this.topicService.getTopicById(comment.topicId);

    // get new mentions
    const newMentions = mentionedProfileIds.filter(
      (id) => !comment.mentionedProfileIds.includes(id),
    );

    if (htmlContent === comment.htmlContent) {
      throw new BadRequestException('Comment contents must be different!');
    }

    comment.textContent = textContent;
    comment.htmlContent = htmlContent;
    comment.mentionedProfileIds = [...mentionedProfileIds];

    await this.commonService.saveEntity(this.commentRepository, comment);

    const newMentionsNotifications = [
      ...newMentions.map((id) =>
        this.notificationService.create({
          targetId: id,
          text: `You have been mentioned by ${user.username} in comment section`,
          url: publicTopic.url,
          viewed: false,
          type: NotificationType.MENTION,
        }),
      ),
    ];

    if (newMentionsNotifications.length > 0) {
      await Promise.all(newMentionsNotifications);
    }

    return comment;
  }

  public async findOneById(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    this.commonService.checkEntityExistence(comment, 'Comment');
    return comment;
  }

  public async findCommentByTopicId(topicId: string): Promise<CommentEntity[]> {
    const comments = await this.commentRepository.find({ where: { topicId } });
    return comments;
  }
}
