import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {


  @Get('/')
  getHello(): string {
    return 'Mkfree Deploy Hello World!';
  }

  @Post('/post')
  postHello(): string {
    return 'Mkfree Deploy Hello World!';
  }
}
