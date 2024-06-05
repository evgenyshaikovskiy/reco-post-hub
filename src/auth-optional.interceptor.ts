import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { JwtService } from './jwt/jwt.service';
import { UserService } from './users/users.service';
import { TokenTypeEnum } from './jwt/enums/token-type.enum';

@Injectable()
export class AuthOptionalInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (!(request.headers['authorization'] as string)?.substring(7)) {
      request.body['user_interceptor'] = null;
    }

    const token = (request.headers['authorization'] as string)?.substring(7);
    // const authToken
    if (!token) {
      request.body['user_interceptor'] = null;
      return next.handle();
    }

    const verified = await this.jwtService.verifyToken(
      token,
      TokenTypeEnum.ACCESS,
    );
    if (!verified && !verified.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneByEmail(verified.sub);

    if (user) {
      request.body['user_interceptor'] = user;
    } else {
      throw new UnauthorizedException();
    }
    return next.handle();
  }
}
