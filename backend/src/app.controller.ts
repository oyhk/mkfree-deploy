import { Controller, Get, Post, Render } from '@nestjs/common';

@Controller()
export class AppController {


  /**
   * 前端渲染
   */
  @Get([
    '/',
    '/project***',
    '/user**',
    '/server**',
    '/env**',
    '/install**',
  ])
  @Render('index')
  index() {
    return {};
  }

}
