import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { UsersModule } from 'src/users/users.module';
import { TopicModule } from 'src/topic/topic.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, UserEntity, TopicEntity]),
    UsersModule,
    TopicModule,
    JwtModule
  ],
  providers: [BookmarkService],
  exports: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
