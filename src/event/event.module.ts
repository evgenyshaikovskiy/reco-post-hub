import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersModule } from 'src/users/users.module';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    JwtService,
  ],
  providers: [EventService],
  exports: [EventService],
  controllers: [],
})
export class EventModule {}
