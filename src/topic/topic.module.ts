import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { TopicPublicController } from './public-topic.controller';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity]),
    JwtModule,
    UsersModule,
    HashtagModule,
  ],
  providers: [TopicService],
  exports: [TopicService],
  controllers: [TopicController, TopicPublicController],
})
export class TopicModule {}
