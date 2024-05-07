import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsEmbeddable } from './embeddables/credentials.embeddable';
import { PublicUserController } from './users-public.controller';
import { UserController } from './user.controller';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CredentialsEmbeddable]),
    JwtModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [PublicUserController, UserController],
})
export class UsersModule {}
