import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IComment } from './interfaces';
import { IsString, MinLength } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';
import { IUser } from 'src/users/interfaces/user.interface';
import { TopicEntity } from 'src/topic/topic.entity';
import { ITopic } from 'src/topic/interfaces/topic.interface';

@Entity()
@Tree('materialized-path')
@Unique(['id'])
export class CommentEntity implements IComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    createForeignKeyConstraints: false,
  })
  author: IUser;

  @ManyToOne(() => TopicEntity, (user) => user.comments, {
    createForeignKeyConstraints: false,
  })
  topic: ITopic;

  @Column({ type: 'varchar' })
  @MinLength(10)
  @IsString()
  textContent: string;

  @Column({ type: 'varchar' })
  @IsString()
  htmlContent: string;

  @TreeParent()
  parentComment: CommentEntity;

  @TreeChildren()
  childComments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
