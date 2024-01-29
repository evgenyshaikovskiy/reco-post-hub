// import { Embeddable, Property } from "@mikro-orm/core";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ICredentials } from '../interfaces/credentials.interface';
import dayjs from 'dayjs';

@Entity()
export class CredentialsEmbeddable implements ICredentials {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'numeric' })
  public version = 0;

  @Column()
  public lastPassword: string = '';

  @Column({ default: dayjs().unix() })
  public passwordUpdatedAt: number = dayjs().unix();

  @Column({ default: dayjs().unix() })
  public updatedAt: number = dayjs().unix();

  public updatePassword(password: string): void {
    this.version++;
    this.lastPassword = password;
    this.passwordUpdatedAt = dayjs().unix();
    this.updatedAt = dayjs().unix();
  }

  public updateVersion(): void {
    this.version++;
    this.updatedAt = dayjs().unix();
  }
}
