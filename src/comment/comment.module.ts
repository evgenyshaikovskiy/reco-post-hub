import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { TopicModule } from 'src/topic/topic.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';
import { PublicCommentController } from './public-comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, TopicEntity]),
    JwtModule,
    UsersModule,
    NotificationModule,
    TopicModule,
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController, PublicCommentController],
})
export class CommentModule {}
