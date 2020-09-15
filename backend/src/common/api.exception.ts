import { HttpException } from '@nestjs/common';
import { ARE } from './api-result';

export class ApiException extends HttpException {
  are: ARE;

  constructor(are: ARE) {
    super(JSON.stringify(are), 200);
    this.are = are;

  }

}