import { Cascade, Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { IBlacklistedToken } from '../interfaces/blacklisted-token.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity({ tableName: 'blacklisted_tokens' })
@Unique({ properties: ['tokenId', 'user'] })
export class BlacklistedTokenEntity implements IBlacklistedToken {
  @Property({
    primary: true,
    columnType: 'uuid',
  })
  tokenId: string;

  @ManyToOne({
    entity: () => UserEntity,
    cascade: [Cascade.REMOVE],
    primary: true,
  })
  user: UserEntity;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
}
