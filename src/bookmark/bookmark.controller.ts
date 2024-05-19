import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './bookmark.interface';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  IPagination,
  PaginationParams,
} from 'src/common/utils/pagination.util';

@UseInterceptors(AuthInterceptor)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly service: BookmarkService) {}

  @Post()
  public async createBookmark(
    @Body() bookmarkDto: CreateBookmarkDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.create(bookmarkDto, user);
  }

  @Get('')
  public async getUserBookmarks(
    @PaginationParams() pagination: IPagination,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.getUserBookmarks(pagination, user);
  }

  @Delete(':id')
  public async removeUserBookmark(
    @Param() params,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.removeBookmark(params.id);
  }
}
