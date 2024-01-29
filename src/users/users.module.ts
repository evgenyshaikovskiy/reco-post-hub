import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsEmbeddable } from './embeddables/credentials.embeddable';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CredentialsEmbeddable])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
