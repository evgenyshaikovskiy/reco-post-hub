import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { CommentService } from './comment.service';
import { CreateAnswerDto, CreateCommentDto } from './dto/create.dto';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { EditCommentDto } from './dto/edit.dto';

@UseInterceptors(AuthInterceptor)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  public async createComment(
    @Body() dto: CreateCommentDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentService.create(dto, user);
  }

  @Patch()
  public async editComment(
    @Body() dto: EditCommentDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentService.update(dto.id, dto, user);
  }

  public async createAnswer(
    @Body() dto: CreateAnswerDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.commentService.createAnswer(dto, user);
  }
}
