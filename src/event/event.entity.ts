import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EventType, IEvent } from './interfaces';

@Entity()
@Unique(['id'])
export class EventEntity implements IEvent {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @Column({ type: 'varchar' })
  emitterId: string;

  @Column({ type: 'varchar' })
  receiverId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
