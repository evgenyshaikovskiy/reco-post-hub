import { Controller, Get, Param } from "@nestjs/common";
import { CommentService } from "./comment.service";

@Controller('comment')
export class PublicCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':topicId')
  public async fetchCommentsForTopic(@Param() params) {
    return await this.commentService.getCommentFromTopic(params.topicId);
  }
}