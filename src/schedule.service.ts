import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TopicService } from './topic/topic.service';
import { UserService } from './users/users.service';
import moment from 'moment';
import { TopicEntity } from './topic/topic.entity';
import { UserEntity } from './users/entities/user.entity';
import { EventService } from './event/event.service';
import { EventType } from './event/interfaces';
import { EventEntity } from './event/event.entity';
import { NotificationService } from './notification/notification.service';
import { NotificationType } from './notification/notification.enum';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly topicService: TopicService,
    private readonly usersService: UserService,
    private readonly eventsService: EventService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleUpdateOfScore() {
    this.logger.log('Begin recalculation of totalScore for topics');
    const topics = await this.topicService.getAllTopics();
    const updatedTopics = topics.map((topic) =>
      this.recalculateTopicScore(topic),
    );

    await this.topicService.updateTopics(updatedTopics);
    this.logger.log('Recalculated totalScore for topics');
  }

  private recalculateTopicScore(topic: TopicEntity): TopicEntity {
    const totalOfScores = topic.scores
      .map((score) => +score.score)
      .reduce((acc, prev) => acc + prev, 0);
    const countOfScores = topic.scores.length;
    const average = totalOfScores / countOfScores;
    this.logger.log(
      `For topic ${topic.title} with total scores: ${totalOfScores} and number of scores ${countOfScores}`,
    );
    return { ...topic, totalScore: average };
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleUpdateOfUserData() {
    this.logger.log('Begin recalculation of karma and ratings for all users');
    const timePeriod = moment().subtract(12, 'hours');
    const users = await this.usersService.getAllUsers();
    const events =
      await this.eventsService.getEventsForRatingRecalculation(timePeriod);

    const updatedUsers = users.map((user) => ({
      ...user,
      rating: user.rating + this.recalculateUserRating(user, events),
      karma: user.karma + this.recalculateUserKarma(user, timePeriod),
    }));
    await this.usersService.updateUsers(updatedUsers);
    this.logger.log('End recalculation of karma and ratings for all users');

    const notifications = updatedUsers.map((user) =>
      this.notificationService.create({
        targetId: user.id,
        text: 'Your rating and karma was updated',
        type: NotificationType.DATA_UPDATED,
        url: 'settings',
        viewed: false,
      }),
    );

    await Promise.all(notifications);
  }

  private recalculateUserKarma(user: UserEntity, date: moment.Moment): number {
    const commentsInInterval = user.comments.filter((comment) =>
      moment(comment.createdAt).isAfter(date),
    );
    const scoresInInterval = user.scores.filter((score) =>
      moment(score.createdAt).isAfter(date),
    );
    this.logger.log(
      `For user ${user.username} there is ${commentsInInterval.length} comments in given time period`,
    );
    this.logger.log(
      `For user ${user.username} there is ${scoresInInterval.length} scores in given time period`,
    );
    return commentsInInterval.length + scoresInInterval.length;
  }

  private recalculateUserRating(
    user: UserEntity,
    events: EventEntity[],
  ): number {
    let ratingDelta = 0;
    const userTopicsIds = user.topics.map((topic) => topic.topicId);
    events.forEach((event) => {
      if (
        event.type === EventType.VIEW_TOPIC ||
        event.type === EventType.VIEW_TOPIC_UNAUTHORIZED
      ) {
        ratingDelta += userTopicsIds.includes(event.receiverId)
          ? event.type === EventType.VIEW_TOPIC
            ? 2
            : 0.1
          : 0;
      } else if (
        event.type === EventType.UPDATE_SCORE ||
        event.type === EventType.ADD_SCORE
      ) {
        const topic = user.topics.find(
          (topic) => topic.topicId === event.receiverId,
        );

        if (topic) {
          ratingDelta += event.type === EventType.ADD_SCORE ? 1 : 0.1;
        }
      } else if (event.type === EventType.TOPIC_PUBLISHED) {
        ratingDelta += user.id === event.emitterId ? 10 : 0;
      } else {
        ratingDelta += event.receiverId === user.id ? 1 : 0;
      }
    });

    return ratingDelta;
  }
}
