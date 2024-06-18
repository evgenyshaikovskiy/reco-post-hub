import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreEntity } from './score.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { TopicService } from 'src/topic/topic.service';
import { CreateScoreDto, UpdateScoreDto } from './score.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventService } from 'src/event/event.service';
import { EventType } from 'src/event/interfaces';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreEntity)
    private readonly repository: Repository<ScoreEntity>,
    private readonly commonService: CommonService,
    private readonly topicsService: TopicService,
    private readonly eventService: EventService,
  ) {}
  private readonly allowedScores = [1, 2, 3, 4, 5];

  public async create(
    dto: CreateScoreDto,
    user: UserEntity,
  ): Promise<ScoreEntity> {
    const { score, topicId } = dto;

    if (!this.allowedScores.includes(score)) {
      throw new BadRequestException('Invalid score given');
    }

    await this._checkScoreUniqueness(topicId, user.id);

    const topic = await this.topicsService.getTopicById(topicId);

    if (!topic) {
      throw new BadRequestException('Topic not found!');
    }

    const entity = this.repository.create({
      actor: user,
      score: score,
      topic: topic,
    });

    await this.commonService.saveEntity(this.repository, entity, true);
    await this.eventService.create({
      emitterId: user.id,
      receiverId: entity.id,
      type: EventType.ADD_SCORE,
    });

    await this.topicsService.recalculateTopicScores(topicId);
    return entity;
  }

  public async delete(id: string, user: UserEntity): Promise<ScoreEntity> {
    const entity = await this.findOneById(id);

    await this.eventService.create({
      emitterId: user.id,
      receiverId: entity.topic.topicId,
      type: EventType.REMOVE_SCORE,
    });

    await this.commonService.removeEntity(this.repository, entity);
    return entity;
  }

  public async update(
    dto: UpdateScoreDto,
    user: UserEntity,
  ): Promise<ScoreEntity> {
    const { id, score } = dto;
    const scoreEntity = await this.findOneById(id);

    if (!this.allowedScores.includes(score) && score !== scoreEntity.score) {
      throw new BadRequestException('Invalid score given!');
    }

    scoreEntity.score = score;

    await this.commonService.saveEntity(this.repository, scoreEntity);
    await this.eventService.create({
      emitterId: user.id,
      receiverId: scoreEntity.id,
      type: EventType.UPDATE_SCORE,
    });

    await this.topicsService.recalculateTopicScores(scoreEntity.topic.topicId);

    return scoreEntity;
  }

  public async findOneById(id: string): Promise<ScoreEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['actor', 'topic'],
    });

    this.commonService.checkEntityExistence(entity, 'Entity');
    return entity;
  }

  private async _checkScoreUniqueness(
    topicId: string,
    userId: string,
  ): Promise<void> {
    const count = await this.repository.count({
      where: {
        actor: {
          id: userId,
        },
        topic: {
          topicId: topicId,
        },
      },
    });

    if (count > 0) {
      throw new ConflictException('Duplicate score attempt');
    }
  }
}
