import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IHashtag } from './interfaces';
import { TopicEntity } from 'src/topic/topic.entity';
import { ITopic } from 'src/topic/interfaces/topic.interface';

@Entity()
@Unique(['id', 'name'])
export class HashtagEntity implements IHashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => TopicEntity, (topic) => topic.hashtags)
  @JoinTable()
  topics: TopicEntity[];
}
