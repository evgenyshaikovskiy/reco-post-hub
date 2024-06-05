import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.factory';
import { ExternalModule } from './external/external.module';
import { TopicModule } from './topic/topic.module';
import { APP_GUARD } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';
import { ResourceModule } from './resources/resource.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { EventModule } from './event/event.module';
import { ScoreModule } from './score/score.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { RecommendationService } from './recommendation.service';
import { HashtagSimilarityModule } from './hashtag-similarity/hashtag-similarity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    UsersModule,
    JwtModule,
    MailerModule,
    AuthModule,
    ExternalModule,
    TopicModule,
    NotificationModule,
    CommentModule,
    HashtagModule,
    ResourceModule,
    SubscriptionModule,
    BookmarkModule,
    HashtagSimilarityModule,
    ScoreModule,
    EventModule,
  ],
  providers: [AppService, ScheduleService, RecommendationService],
})
export class AppModule {}
