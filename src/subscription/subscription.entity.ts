import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ISubscription, SubscriptionType } from './interfaces';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity()
@Unique(['id'])
export class SubscriptionEntity implements ISubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.subscriptions, {
    createForeignKeyConstraints: false,
  })
  actor: UserEntity;

  @Column({ type: 'enum', enum: SubscriptionType })
  type: SubscriptionType;

  @Column({ type: 'varchar' })
  targetId: string;

  @CreateDateColumn()
  emittedAt: Date;
}
