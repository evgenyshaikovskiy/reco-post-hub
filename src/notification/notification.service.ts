import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(dto: CreateNotificationDto): Promise<NotificationEntity> {
    const { type, text, targetId, url, viewed } = dto;

    const notificationEntity = this.notificationRepository.create({
      targetId: targetId,
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
    targetId: number,
  ): Promise<NotificationEntity[]> {
    const notifications = await this.notificationRepository.find({
      where: { targetId },
    });

    return notifications;
  }
}
