import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { CreateEventDto } from './dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(dto: CreateEventDto) {

  }
}
