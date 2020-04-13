import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { Server } from './server.entity';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerDto } from './server.dto';
import { ApiResult } from '../common/api-result';
import { Page } from '../common/page';

@Controller()
export class ServerController {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {
  }

  @Post('/api/servers/save')
  async save(@Body() dto: ServerDto, @Res() res: Response) {
    const apiResult = new ApiResult();
    apiResult.result = await this.serverRepository.save(dto);
    return res.json(apiResult);
  }

  @Put('/api/servers/update')
  async update(@Body() dto: ServerDto, @Res() res: Response) {
    const apiResult = new ApiResult();
    apiResult.result = await this.serverRepository.save(dto);
    return res.json(apiResult);
  }

  @Get('/api/servers/page')
  async page(@Query() dto: ServerDto, @Res() res: Response) {
    const page = new Page();
    await this.serverRepository.createQueryBuilder('s')
      .skip(dto.pageNo - 1)
      .take(dto.pageSize)
      .getManyAndCount()
      .then(value => {
        page.data = value[0];
        page.total = value[1];
      });
    page.pageNo = dto.pageNo;
    page.pageSize = dto.pageSize;
    // 分页总数，总记录数 / 页条数，当存在小数点，使用了 Math.ceil 直接网上取整数
    page.totalPage = Math.ceil(page.total / page.pageSize);
    return res.json(page);
  }

  @Get('/api/servers/list')
  async list(@Query() dto: ServerDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result  = await this.serverRepository.find(dto);
    return res.json(ar);
  }

}
