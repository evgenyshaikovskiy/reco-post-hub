import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { CreateSubscriptionDto, SubscriptionType } from './interfaces';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventService } from 'src/event/event.service';
import { EventType } from 'src/event/interfaces';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly repository: Repository<SubscriptionEntity>,
    private readonly commonService: CommonService,
    private readonly eventService: EventService,
  ) {}

  public async create(
    dto: CreateSubscriptionDto,
    user: UserEntity,
  ): Promise<SubscriptionEntity> {
    const { type, targetId } = dto;
    await this.checkSubscriptionUniqueness(targetId, user);

    const subscription = this.repository.create({
      actor: user,
      targetId: targetId,
      type: type,
    });

    await this.commonService.saveEntity(this.repository, subscription, true);
    await this.eventService.create({
      emitterId: user.id,
      type:
        type === SubscriptionType.TO_USER
          ? EventType.SUBSCRIBE_TO_USER
          : EventType.SUBSCRIBE_TO_HASHTAG,
      receiverId: targetId,
    });

    return subscription;
  }

  public async getAllSubscriptions(
    user: UserEntity,
  ): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.repository.find({
      where: {
        actor: {
          id: user.id,
        },
      },
    });

    return subscriptions;
  }

  public async getHashtagsSubscriptions(
    user: UserEntity,
  ): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.repository.find({
      where: [
        {
          actor: {
            id: user.id,
          },
          type: SubscriptionType.TO_HASHTAG,
        },
      ],
    });

    return subscriptions;
  }

  public async getUsersSubscriptions(
    user: UserEntity,
  ): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.repository.find({
      where: [
        {
          actor: {
            id: user.id,
          },
          type: SubscriptionType.TO_USER,
        },
      ],
    });

    return subscriptions;
  }

  public async deleteSubscriptionById(
    id: string,
    user: UserEntity,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findOneById(id);
    await this.commonService.removeEntity(this.repository, subscription);
    await this.eventService.create({
      emitterId: user.id,
      type:
        subscription.type === SubscriptionType.TO_USER
          ? EventType.UNSUBSCRIBE_FROM_USER
          : EventType.UNSUBSCRIBE_FROM_HASHTAG,
      receiverId: subscription.targetId,
    });
    return subscription;
  }

  public async findOneById(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.repository.findOne({ where: { id } });
    this.commonService.checkEntityExistence(subscription, 'Subscription');
    return subscription;
  }

  private async checkSubscriptionUniqueness(
    targetId: string,
    user: UserEntity,
  ): Promise<void> {
    const subs = await this.repository.find({
      where: {
        targetId,
        actor: {
          id: user.id,
        },
      },
    });

    if (subs.length > 0) {
      throw new ConflictException('Subscription already exist.');
    }
  }
}
