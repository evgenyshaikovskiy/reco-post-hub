import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BlacklistedTokenEntity } from './entities/blacklisted-token.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { ValidatorController } from './validator.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistedTokenEntity]),
    UsersModule,
    JwtModule,
    MailerModule,
    NotificationModule,
  ],
  providers: [AuthService],
  controllers: [AuthController, ValidatorController],
})
export class AuthModule {}
