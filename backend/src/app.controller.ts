import { Controller, Get, Post, Render } from '@nestjs/common';

@Controller()
export class AppController {


  @Get('/')
  getHello(): string {
    return 'Mkfree Deploy Hello World!';
  }

  @Get('/mkfree-deploy***')
  @Render('index')
  root() {
    return {};
  }

  @Post('/post')
  postHello(): string {
    return 'Mkfree Deploy Hello World!';
  }
}
