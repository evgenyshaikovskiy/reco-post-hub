import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BlacklistedTokenEntity } from './entities/blacklisted-token.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistedTokenEntity]),
    UsersModule,
    JwtModule,
    MailerModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}