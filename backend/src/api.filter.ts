import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiException } from './common/api.exception';

@Catch(ApiException)
export class ApiFilter implements ExceptionFilter {


  catch(exception: ApiException, host: ArgumentsHost) {
    console.log('exception.message',JSON.stringify(exception));
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(200).json(exception.are);
  }
}