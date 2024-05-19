import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { TopicPublicController } from './public-topic.controller';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventModule } from 'src/event/event.module';
import { BookmarkEntity } from 'src/bookmark/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, UserEntity, BookmarkEntity]),
    JwtModule,
    UsersModule,
    HashtagModule,
    EventModule,
  ],
  providers: [TopicService],
  exports: [TopicService],
  controllers: [TopicController, TopicPublicController],
})
export class TopicModule {}
