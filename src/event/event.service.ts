import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { CreateEventDto } from './dto';
import { EventType } from './interfaces';
import moment from 'moment';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(dto: CreateEventDto): Promise<boolean> {
    const { type, receiverId, emitterId } = dto;

    if (type === EventType.VIEW_TOPIC) {
      const isDuplicate = await this._isDuplicateView(
        type,
        receiverId,
        emitterId,
      );
      if (isDuplicate) return false;
    }

    const entity = this.repository.create({
      receiverId,
      emitterId,
      type,
    });

    await this.commonService.saveEntity(this.repository, entity, true);

    return true;
  }

  public async getEventsForRatingRecalculation(
    date: moment.Moment,
  ): Promise<EventEntity[]> {
    const eventTypeForRecalculation = [
      EventType.SUBSCRIBE_TO_USER,
      EventType.VIEW_TOPIC,
      EventType.VIEW_TOPIC_UNAUTHORIZED,
      EventType.ADD_SCORE,
      EventType.TOPIC_PUBLISHED,
      EventType.UPDATE_SCORE,
    ];

    const events = await this.repository.find({});
    return events.filter(
      (event) =>
        eventTypeForRecalculation.includes(event.type) &&
        moment(event.createdAt).isAfter(date),
    );
  }

  private async _isDuplicateView(
    type: EventType,
    receiverId: string,
    emitterId: string,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: { emitterId, receiverId, type },
    });

    return count > 0;
  }
}
