import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtService } from '@nestjs/jwt';
import { ApiResult, ApiResultCode } from './common/api-result';
import { UserDto } from './user/user.dto';
import { UserAuth, UserAuthOperation } from './user/user-auth';

export class AuthInterceptor implements NestInterceptor {


  constructor(private readonly jwtService: JwtService) {

  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ar = new ApiResult();
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const notAuthUrlList = ['/api/users/login'];
    // 不需要认证url
    if (notAuthUrlList.includes(req.url)) {
      return next.handle();
    }

    const accessToken = req.headers.access_token;
    // access_token 为空，返回access_token无效
    if (!accessToken) {
      ar.remind(ApiResultCode['103']);
      res.status(200).json(ar);
      return of();
    }
    const userAuth = this.jwtService.decode(accessToken) as UserAuth;
    console.log('userAuth', userAuth);
    if (userAuth === null) {
      ar.remind(ApiResultCode['103']);
      res.status(200).json(ar);
      return of();
    }
    if (new Date().getTime() > userAuth.exp * 1000) {
      ar.remind(ApiResultCode['104']);
      res.status(200).json(ar);
      return of();
    }
    return next.handle();
  }

}