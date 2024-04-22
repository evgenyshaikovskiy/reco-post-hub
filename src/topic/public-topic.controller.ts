import { Controller, Get, Param } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicPublicController {
  constructor(private readonly topicService: TopicService) {}

  @Get(':url')
  public async getTopic(@Param() params) {
    const entity = await this.topicService.getTopicByUrl(params.url);
    return entity;
  }

  @Get('last/:number')
  public async getLastTopics(@Param() params) {
    const lastCreatedTopics = await this.topicService.getNumberOfTopics(params.number);
    return lastCreatedTopics;
  }
}
