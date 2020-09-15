import { HttpException } from '@nestjs/common';
import { ARE } from './api-result';

export class ApiException extends HttpException {
  are: any;

  constructor(are: ARE, descEx?: string) {
    super(are.desc + descEx ? descEx : '', are.code);
    this.are = are;
  }

}