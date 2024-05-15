import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { INotification } from './interfaces';
import { NotificationType } from './notification.enum';
import { IsString } from 'class-validator';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';

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

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    createForeignKeyConstraints: false,
  })
  receiver: IUser;

  @Column({ type: 'varchar' })
  url?: string;

  @Column({ type: 'boolean' })
  viewed: boolean = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
