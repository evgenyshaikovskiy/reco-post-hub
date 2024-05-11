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

  @Column({ type: 'varchar' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
