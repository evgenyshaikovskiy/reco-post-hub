import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsEmbeddable } from './embeddables/credentials.embeddable';
import { PublicUserController } from './users-public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CredentialsEmbeddable])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [PublicUserController],
})
export class UsersModule {}
