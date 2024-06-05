import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { HashtagSimilarityService } from './hashtag-similarity.service';
import { HashtagSimilarityEntity } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashtagSimilarityEntity, HashtagEntity]),
    HashtagModule,
  ],
  providers: [HashtagSimilarityService],
  exports: [HashtagSimilarityService],
})
export class HashtagSimilarityModule {}
