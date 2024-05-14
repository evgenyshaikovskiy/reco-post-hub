import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntity } from './score.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TopicModule } from 'src/topic/topic.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreEntity, UserEntity, TopicEntity]),
    JwtModule,
    UsersModule,
    TopicModule,
    EventModule,
  ],
  providers: [ScoreService],
  exports: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
