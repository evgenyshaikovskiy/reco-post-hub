import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { LogoutDto } from './dtos/log-out.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/notification.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('/sign-up')
  public async signUp(@Body() dto: SignUpDto) {
    const message = await this.authService.signUp(dto);
    return message.message;
  }

  @Post('/sign-in')
  public async signIn(@Body() dto: SignInDto) {
    return await this.authService.singIn(dto);
  }

  @Post('/refresh')
  public async refreshToken(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshTokenAccess(dto.refreshToken);
  }

  @Get('/confirm/:token')
  public async confirmEmail(@Param() params: { token: string }) {
    try {
      const result = await this.authService.confirmUserEmail(params.token);

      if (result) {
        await this.notificationService.create({
          targetId: result.id,
          text: 'Your account was created',
          type: NotificationType.CREATED,
          viewed: false,
        });
      }
      // TODO: redirect or render template
      return {
        message: `Email ${result.email} for ${result.name} account was confirmed, you can login successfully on main website page`,
      };
    } catch (error) {
      return error;
    }
  }

  @Post('/logout')
  public async logout(@Body() dto: LogoutDto) {
    return (await this.authService.logout(dto.refreshToken)).message;
  }
}
