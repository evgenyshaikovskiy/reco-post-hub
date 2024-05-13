import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { compare, hash } from 'bcrypt';
import { isNull, isUndefined } from 'src/common/utils/validation.util';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangeEmailDto } from './dtos/change-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserProfile, UserRole } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(
    email: string,
    name: string,
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const formattedEmail = email.toLowerCase();
    const formattedUsername = username.trim();
    await this._checkEmailUniqueness(formattedEmail);
    await this._checkUsernameUniqueness(formattedUsername);
    const formattedName = this.commonService.formatName(name);
    const user = this.usersRepository.create({
      email: formattedEmail,
      name: formattedName,
      username: formattedUsername,
      password: await hash(password, 10),
      role: UserRole.USER,
      userPictureId: 'default',
      subscriptions: [],
      topics: [],
    });

    await this.commonService.saveEntity(this.usersRepository, user, true);
    return user;
  }

  public async findProfileByUsername(username: string): Promise<IUserProfile> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    this.commonService.checkEntityExistence(user, 'User');
    return user as IUserProfile;
  }

  public async findOneById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    this.commonService.checkEntityExistence(user, 'User');
    return user;
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
      relations: ['topics', 'subscriptions'],
    });
    this._throwUnauthorizedException(user);
    return user;
  }

  public async findOneByCredentials(
    id: string,
    version: number,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    this._throwUnauthorizedException(user);

    if (user.credentials.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async findOneByUsername(
    username: string,
    forAuth: boolean = false,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (forAuth) {
      this._throwUnauthorizedException(user);
    } else {
      this.commonService.checkEntityExistence(user, 'User');
    }

    return user;
  }

  public async update(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    const { name, username, confirmed, userPictureId } = dto;

    if (!isUndefined(name) && !isNull(name)) {
      if (name === user.name) {
        throw new BadRequestException('Name must be different');
      }

      user.name = this.commonService.formatName(name);
    }

    if (!isUndefined(username) && !isNull(username)) {
      const formattedUsername = dto.username.toLowerCase();

      if (user.username === formattedUsername) {
        throw new BadRequestException('Username should be different');
      }

      await this._checkUsernameUniqueness(formattedUsername);
      user.username = formattedUsername;
    }

    if (!isUndefined(confirmed) && !isNull(confirmed)) {
      user.confirmed = confirmed;
    }

    if (!isUndefined(userPictureId)) {
      user.userPictureId = userPictureId;
    }

    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updateEmail(
    userId: string,
    dto: ChangeEmailDto,
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    const { email, password } = dto;

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const formattedEmail = email.toLowerCase();
    await this._checkEmailUniqueness(formattedEmail);
    user.credentials.updateVersion();
    user.email = formattedEmail;
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updatePassword(
    userId: string,
    password: string,
    newPassword: string,
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    if (await compare(newPassword, user.password)) {
      throw new BadRequestException('New password must be different');
    }

    user.credentials.updatePassword(user.password);
    user.password = await hash(newPassword, 10);
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async resetPassword(
    userId: string,
    version: number,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.findOneByCredentials(userId, version);
    user.credentials.updatePassword(user.password);
    user.password = await hash(password, 10);
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async remove(userId: string): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    await this.commonService.removeEntity(this.usersRepository, user);
    return user;
  }

  // password reset
  public async uncheckedUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  private async _checkUsernameUniqueness(username: string): Promise<void> {
    const count = await this.usersRepository.count({ where: { username } });
    if (count > 0) {
      throw new ConflictException('Username already in use');
    }
  }

  private async _checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.usersRepository.count({ where: { email } });

    if (count > 0) {
      throw new ConflictException('Email already in use');
    }
  }

  // private async _generateUsername(name: string): Promise<string> {
  //   const pointSlug = this.commonService.generatePointSlug(name);
  //   const count = await this.usersRepository.count({
  //     username: `${pointSlug}%`,
  //   });

  //   if (count > 0) {
  //     return `${pointSlug}${count}`;
  //   }

  //   return pointSlug;
  // }

  private _throwUnauthorizedException(
    user: undefined | null | UserEntity,
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
