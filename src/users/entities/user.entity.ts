import { IUser, UserRole } from '../interfaces/user.interface';
import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator';
import {
  BCRYPT_HASH,
  NAME_REGEX,
  SLUG_REGEX,
} from 'src/common/consts/regex.const';
import { CredentialsEmbeddable } from '../embeddables/credentials.embeddable';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from 'src/subscription/subscription.entity';
import { ISubscription } from 'src/subscription/interfaces';
import { TopicEntity } from 'src/topic/topic.entity';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { ScoreEntity } from 'src/score/score.entity';
import { ISettings } from '../interfaces/settings.interface';
import { SettingsEmbeddable } from '../embeddables/settings.embeddable';
import { NotificationEntity } from 'src/notification/notification.entity';
import { INotification } from 'src/notification/interfaces';
import { BookmarkEntity } from 'src/bookmark/bookmark.entity';

@Entity()
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  public name: string;

  @Column({ type: 'varchar', length: 106 })
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slugs',
  })
  public username: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;

  @Column({ type: 'varchar', length: 60 })
  @IsString()
  @Length(59, 60)
  @Matches(BCRYPT_HASH)
  public password: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  public confirmed: true | false = false;

  @Column(() => CredentialsEmbeddable)
  public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

  @Column({ type: 'varchar' })
  public bio: string;

  @Column({ type: 'numeric' })
  public karma: number;

  @Column({ type: 'numeric' })
  public rating: number;

  @Column(() => SettingsEmbeddable)
  public settings: SettingsEmbeddable = new SettingsEmbeddable();

  @OneToMany(() => NotificationEntity, (notification) => notification.receiver)
  public notifications: INotification[];

  @Column({ type: 'varchar' })
  public userPictureId: string;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.actor, {
    // eager: true,
  })
  public subscriptions: ISubscription[];

  @OneToMany(() => TopicEntity, (topic) => topic.author, {
    // eager: true,
  })
  public topics: ITopic[];

  @Column({ type: 'enum', enum: UserRole })
  public role: UserRole;

  @OneToMany(() => ScoreEntity, (score) => score.actor)
  public scores: ScoreEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  public bookmarks: BookmarkEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date = new Date();
}
