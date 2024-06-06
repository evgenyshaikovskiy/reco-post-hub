import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { HashtagSimilarityService } from './hashtag-similarity.service';
import { HashtagSimilarityEntity } from './entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { RecommendedHashtagsController } from './hashtag-similarity.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashtagSimilarityEntity, HashtagEntity]),
    HashtagModule,
    SubscriptionModule,
    JwtModule,
    UsersModule,
  ],
  providers: [HashtagSimilarityService],
  exports: [HashtagSimilarityService],
  controllers: [RecommendedHashtagsController],
})
export class HashtagSimilarityModule {}
