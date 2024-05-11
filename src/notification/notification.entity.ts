import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { INotification } from './interfaces';
import { NotificationType } from './notification.enum';
import { IsString } from 'class-validator';

@Entity()
@Unique(['id'])
export class NotificationEntity implements INotification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'varchar' })
  @IsString()
  text: string;

  @Column({ type: 'varchar' })
  targetId: string;

  @Column({ type: 'varchar' })
  url?: string;

  @Column({ type: 'boolean' })
  viewed: boolean = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
