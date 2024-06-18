import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { EventService } from 'src/event/event.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { EventModule } from 'src/event/event.module';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity, UserEntity]),
    HashtagModule,
    UsersModule,
    TopicModule,
    JwtModule,
    EventModule,
    NotificationModule,
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
