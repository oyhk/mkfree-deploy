import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {


  @Get('/')
  getHello(): string {
    return 'Mkfree Deploy Hello World!';
  }
}
