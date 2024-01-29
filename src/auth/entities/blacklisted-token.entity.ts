import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IBlacklistedToken } from '../interfaces/blacklisted-token.interface';

@Entity()
@Unique(['tokenId', 'userId'])
export class BlacklistedTokenEntity implements IBlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  tokenId: string;

  @Column('numeric')
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
