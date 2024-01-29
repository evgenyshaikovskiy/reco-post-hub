import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BlacklistedTokenEntity } from './entities/blacklisted-token.entity';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { TokenTypeEnum } from 'src/jwt/enums/token-type.enum';
import { SignUpDto } from './dtos/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { SignInDto } from './dtos/sign-in.dto';
import { IAuthResult } from './interfaces/auth-result';
import { compare } from 'bcrypt';
import { ICredentials } from 'src/users/interfaces/credentials.interface';
import dayjs from 'dayjs';
import { IRefreshToken } from 'src/jwt/interfaces/refresh-token.interface';
import { EmailDto } from './dtos/email.dto';
import { isNull, isUndefined } from 'src/common/utils/validation.util';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BlacklistedTokenEntity)
    private readonly blacklistedTokensRepository: Repository<BlacklistedTokenEntity>,
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  public async signUp(dto: SignUpDto, domain?: string): Promise<IMessage> {
    const { name, email, password, username, passwordConfirmation } = dto;
    this._comparePasswords(password, passwordConfirmation);
    const user = await this.usersService.create(
      email,
      name,
      username,
      password,
    );
    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain,
    );

    this.mailerService.sendConfirmationEmail(user, confirmationToken);
    return this.commonService.generateMessage(
      'Registration successful. Check your email for verification.',
    );
  }

  public async singIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { email, password } = dto;
    const user = await this.usersService.findOneByEmail(email);

    if (!(await compare(password, user.password))) {
      await this._checkLastPassword(user.credentials, password);
    }
    if (!user.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain,
      );
      this.mailerService.sendConfirmationEmail(user, confirmationToken);
      throw new UnauthorizedException(
        'Please confirm your email, a new email has been sent',
      );
    }

    const [accessToken, refreshToken] = await this._generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
    await this._checkIfTokenIsBlacklisted(id, tokenId);
    const user = await this.usersService.findOneByCredentials(id, version);
    const [accessToken, newRefreshToken] = await this._generateAuthTokens(
      user,
      domain,
      tokenId,
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  public async logout(refreshToken: string): Promise<IMessage> {
    const { id, tokenId } = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    await this._blacklistToken(id, tokenId);
    return this.commonService.generateMessage('Logout successful');
  }

  public async resetPasswordEmail(
    dto: EmailDto,
    domain?: string,
  ): Promise<IMessage> {
    const user = await this.usersService.uncheckedUserByEmail(dto.email);

    if (!isUndefined(user) && !isNull(user)) {
      const resetToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.RESET_PASSWORD,
        domain,
      );
      this.mailerService.sendResetPasswordEmail(user, resetToken);
    }

    return this.commonService.generateMessage('Reset password email sent');
  }

  // TODO: add dto and refactor method logic
  // public async resetPassword(dto: ResetPasswordDto): Promise<IMessage> {
  //   const { password, passwordConfirmation, resetToken } = dto;
  //   const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
  //     resetToken,
  //     TokenTypeEnum.RESET_PASSWORD,
  //   );
  //   this._comparePasswords(password, passwordConfirmation);
  //   await this.usersService.resetPassword(id, version, password);
  //   return this.commonService.generateMessage('Password reset successful');
  // }

  public async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<IAuthResult> {
    const { password, passwordConfirmation, passwordMain } = dto;
    this._comparePasswords(password, passwordConfirmation);
    const user = await this.usersService.updatePassword(
      userId,
      passwordMain,
      password,
    );
    const [accessToken, refreshToken] = await this._generateAuthTokens(user);
    return { user, accessToken, refreshToken };
  }

  public async confirmUserEmail(confirmationToken: string) {
    const result = await this.jwtService.verifyToken(
      confirmationToken,
      TokenTypeEnum.CONFIRMATION,
    );

    const userId = result.id;

    return await this.usersService.update(userId, { confirmed: true });
  }

  private async _blacklistToken(
    userId: number,
    tokenId: string,
  ): Promise<void> {
    const blacklistedToken = this.blacklistedTokensRepository.create({
      userId,
      tokenId,
    });
    await this.commonService.saveEntity(
      this.blacklistedTokensRepository,
      blacklistedToken,
      true,
    );
  }

  private async _checkIfTokenIsBlacklisted(
    userId: number,
    tokenId: string,
  ): Promise<void> {
    const count = await this.blacklistedTokensRepository.count({
      where: {
        tokenId,
        userId,
      },
    });

    if (count > 0) {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async _checkLastPassword(
    credentials: ICredentials,
    password: string,
  ): Promise<void> {
    const { lastPassword, passwordUpdatedAt } = credentials;

    if (lastPassword.length === 0 || !(await compare(password, lastPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const now = dayjs();
    const time = dayjs.unix(passwordUpdatedAt);
    const months = now.diff(time, 'month');
    const message = 'You changed your password ';

    if (months > 0) {
      throw new UnauthorizedException(
        message + months + (months > 1 ? ' months ago' : ' month ago'),
      );
    }

    const days = now.diff(time, 'day');

    if (days > 0) {
      throw new UnauthorizedException(
        message + days + (days > 1 ? ' days ago' : ' day ago'),
      );
    }

    const hours = now.diff(time, 'hour');

    if (hours > 0) {
      throw new UnauthorizedException(
        message + hours + (hours > 1 ? ' hours ago' : ' hour ago'),
      );
    }

    throw new UnauthorizedException(message + 'recently');
  }

  private _comparePasswords(password: string, passwordConfirm: string): void {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  private async _generateAuthTokens(
    user: UserEntity,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId,
      ),
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId,
      ),
    ]);
  }
}
