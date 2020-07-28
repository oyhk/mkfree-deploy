import { HttpException } from '@nestjs/common';

export class AuthException extends HttpException {
  ar: any;

  constructor(ar) {
    super(ar.desc,ar.code);
    this.ar = ar;
  }

}