import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentPublicController } from './public-comment.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    JwtModule,
    UsersModule,
    NotificationModule,
    TopicModule,
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController, CommentPublicController],
})
export class CommentModule {}
