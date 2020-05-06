import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { IncomingMessage, ServerResponse } from 'http';
import { JwtService } from '@nestjs/jwt';
import { ApiResult, ApiResultCode } from './common/api-result';
import { UserDto } from './user/user.dto';
import { UserAuth } from './user/user-auth';
import { Request, Response } from 'express-serve-static-core';

export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ar = new ApiResult();
    const http = context.switchToHttp();
    const req = http.getRequest() as Request;
    const res = http.getResponse() as Response;

    const notAuthUrlList = [
      '/api/users/login',
      '/api/systems/install',
    ];
    // 不需要认证url
    if (notAuthUrlList.includes(req.url)) {
      return next.handle();
    }

    const accessToken = req.headers.access_token;
    // access_token 为空，返回access_token无效
    if (!accessToken) {
      ar.remind(ApiResultCode['103']);
      return of(ar);
    }
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    if (userAuth === null) {
      ar.remind(ApiResultCode['103']);
      return of(ar);
    }
    if (new Date().getTime() > userAuth.exp * 1000) {
      ar.remind(ApiResultCode['104']);
      return of(ar);
    }
    return next.handle();
  }

}