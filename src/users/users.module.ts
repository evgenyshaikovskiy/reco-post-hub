import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsEmbeddable } from './embeddables/credentials.embeddable';
import { PublicUserController } from './users-public.controller';
import { UserController } from './user.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';
import { TopicEntity } from 'src/topic/topic.entity';
import { SettingsEmbeddable } from './embeddables/settings.embeddable';
import { NotificationEntity } from 'src/notification/notification.entity';
import { ScoreEntity } from 'src/score/score.entity';
import { BookmarkEntity } from 'src/bookmark/bookmark.entity';
import { CommentEntity } from 'src/comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CredentialsEmbeddable,
      SettingsEmbeddable,
      ScoreEntity,
      SubscriptionEntity,
      CommentEntity,
      TopicEntity,
      NotificationEntity,
      BookmarkEntity,
    ]),
    JwtModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [PublicUserController, UserController],
})
export class UsersModule {}
