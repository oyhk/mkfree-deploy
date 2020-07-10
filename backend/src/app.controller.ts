import { Controller, Get, Post, Render } from '@nestjs/common';

@Controller()
export class AppController {


  /**
   * 前端渲染
   */
  @Get([
    '/',
    '/project***',
    '/plan***',
    '/user**',
    '/server**',
    '/env**',
    '/install**',
    '/plugin**',
  ])
  @Render('index')
  index() {
    return {};
  }

}
