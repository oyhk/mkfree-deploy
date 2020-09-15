import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ApiResultCode } from './common/api-result';
import { UserAuth } from './user/user-auth';
import { JwtService } from '@nestjs/jwt';
import { AuthException } from './common/auth.exception';


export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.access_token;


    const notAuthUrlList = [
      '/api/users/login',
      '/api/systems/install',
      '/api/systems/installed',
    ];
    // 不需要认证url
    if (notAuthUrlList.includes(request.url) && request.url.indexOf('/api') === -1) {
      return true;
    }

    // access_token 为空，返回access_token无效
    if (!accessToken) {
      throw new AuthException(ApiResultCode['103']);
    }
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    if (userAuth === null) {
      throw new AuthException(ApiResultCode['103']);
    }
    // access_token 已过期
    if (new Date().getTime() > userAuth.exp * 1000) {
      throw new AuthException(ApiResultCode['104']);
    }

    return true;
  }
}