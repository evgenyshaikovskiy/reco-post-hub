import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IHashtagSimilarity } from './interface';
import { IHashtag } from 'src/hashtag/interfaces';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';

@Entity()
export class HashtagSimilarityEntity implements IHashtagSimilarity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => HashtagEntity)
  @JoinColumn()
  public hashtag: HashtagEntity;

  @Column('simple-array')
  otherHashtags: string[];
}
