import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ITopic } from './interfaces/topic.interface';
import { IsString, MinLength } from 'class-validator';
import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ScoreEntity } from 'src/score/score.entity';
import { BookmarkEntity } from 'src/bookmark/bookmark.entity';
import { CommentEntity } from 'src/comment/comment.entity';

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

  @OneToMany(() => CommentEntity, (comment) => comment.topic, {
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

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

  @Column({ type: 'boolean' })
  published: boolean;

  @ManyToMany(() => HashtagEntity, (hashtag) => hashtag.topics, {
    eager: true,
    cascade: ['remove'],
  })
  @JoinTable()
  hashtags: HashtagEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.topic, {
    onDelete: 'CASCADE',
  })
  relatedBookmarks: BookmarkEntity[];

  @OneToMany(() => ScoreEntity, (score) => score.topic, {
    onDelete: 'CASCADE',
  })
  scores: ScoreEntity[];

  @Column({ type: 'numeric' })
  totalScore: number;

  @Column({ type: 'varchar' })
  htmlContent: string;

  @Column({ type: 'varchar' })
  summarization: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
