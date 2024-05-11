import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ITopic } from './interfaces/topic.interface';
import { IsString, MinLength } from 'class-validator';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { IHashtag } from 'src/hashtag/interfaces';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity()
@Unique(['topicId', 'url'])
export class TopicEntity implements ITopic {
  @PrimaryGeneratedColumn('uuid')
  topicId: string;

  // add eager
  @ManyToOne(() => UserEntity, (user) => user.topics, {
    createForeignKeyConstraints: false,
  })
  author: UserEntity;

  @Column({ type: 'varchar' })
  @IsString()
  url: string;

  @Column({ type: 'varchar' })
  @IsString()
  title: string;

  @Column({ type: 'varchar' })
  @IsString()
  @MinLength(100)
  textContent: string;

  @ManyToMany(() => HashtagEntity, (hashtag) => hashtag.topics, { eager: true })
  @JoinTable()
  hashtags: HashtagEntity[];

  @Column({ type: 'varchar' })
  @IsString()
  htmlContent: string;

  @Column({ type: 'varchar' })
  @IsString()
  summarization: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
