import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IScore } from './score.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';

@Entity()
export class ScoreEntity implements IScore {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.scores, {
    createForeignKeyConstraints: false,
  })
  actor: IUser;

  @Column({ type: 'numeric' })
  score: number;

  @ManyToOne(() => TopicEntity, (topic) => topic.scores, {
    createForeignKeyConstraints: false,
  })
  topic: ITopic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
