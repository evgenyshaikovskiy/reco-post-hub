import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, UserEntity, TopicEntity]),
  ],
  providers: [BookmarkService],
  exports: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
