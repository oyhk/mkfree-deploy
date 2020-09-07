import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthException } from './common/auth.exception';

@Catch(AuthException)
export class AuthFilter implements ExceptionFilter {


  catch(exception: AuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(200).json(exception.ar);
  }
}