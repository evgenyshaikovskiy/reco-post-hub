import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagEntity } from './hashtag.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { HashtagPublicController } from './public-hashtag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HashtagEntity]), JwtModule],
  providers: [HashtagService],
  exports: [HashtagService],
  controllers: [HashtagController, HashtagPublicController],
})
export class HashtagModule {}
