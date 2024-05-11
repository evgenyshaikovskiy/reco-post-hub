import { IUser } from '../interfaces/user.interface';
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
  public userPictureId: string;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.actor, {
    eager: true,
  })
  public subscriptions: ISubscription[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date = new Date();
}
