import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentPublicController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':topicId')
  public async getComments(@Param() params) {
    return await this.commentService.findCommentByTopicId(params.topicId);
  }
}
