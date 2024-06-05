import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ISettings } from '../interfaces/settings.interface';
import dayjs from 'dayjs';

@Entity()
export class SettingsEmbeddable implements ISettings {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'boolean' })
  showBio: boolean = false;

  @Column({ type: 'boolean' })
  showEmail: boolean = false;

  @Column({ type: 'boolean' })
  showUserSubscriptions: boolean = false;

  @Column({ type: 'boolean' })
  showHashtagSubscriptions: boolean = false;

  @Column({ type: 'boolean' })
  showComments: boolean = false;

  @Column({ type: 'boolean' })
  showKarma: boolean = false;

  @Column({ type: 'boolean' })
  showRating: boolean = false;

  @Column({ type: 'boolean' })
  showScores: boolean = false;

  @Column({ default: dayjs().unix() })
  public updatedAt: number = dayjs().unix();
}
