import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create.dto';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly commonService: CommonService,
    private readonly userService: UsersService,
  ) {}

  public async create(dto: CreateNotificationDto): Promise<NotificationEntity> {
    const { type, text, targetId, url, viewed } = dto;

    const user = await this.userService.findOneById(targetId);

    if (!user) {
      throw new BadRequestException('User is not found.');
    }

    const notificationEntity = this.notificationRepository.create({
      receiver: user,
      text: text,
      type: type,
      url: url ?? '',
      viewed: viewed,
    });

    await this.commonService.saveEntity(
      this.notificationRepository,
      notificationEntity,
      true,
    );

    return notificationEntity;
  }

  public async markAsViewed(id: string): Promise<NotificationEntity> {
    const notificationEntity = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notificationEntity) {
      throw new BadRequestException('No such notification');
    }

    notificationEntity.viewed = true;

    await this.commonService.saveEntity(
      this.notificationRepository,
      notificationEntity,
    );

    return notificationEntity;
  }

  public async getAllNotificationsForUser(
    targetId: string,
  ): Promise<NotificationEntity[]> {
    const notifications = await this.notificationRepository.find({
      where: { receiver: { id: targetId } },
    });

    return notifications;
  }
}
