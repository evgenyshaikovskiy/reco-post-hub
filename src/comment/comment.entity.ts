import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IComment } from './interfaces';
import { IsString, MinLength } from 'class-validator';

@Entity()
@Unique(['id'])
export class CommentEntity implements IComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric')
  authorId: number;

  @Column({ type: 'varchar' })
  @IsString()
  topicId: string;

  @Column({ type: 'varchar' })
  @MinLength(10)
  @IsString()
  textContent: string;

  @Column({ type: 'varchar' })
  @IsString()
  htmlContent: string;

  @Column('text', { array: true })
  mentionedProfileIds: number[] = [];

  @ManyToOne(() => CommentEntity, comment => comment.childComments)
  parentComment: CommentEntity;

  @OneToMany(() => CommentEntity, comment => comment.parentComment)
  childComments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
