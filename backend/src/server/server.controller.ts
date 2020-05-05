import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { Server } from './server.entity';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerDto } from './server.dto';
import { ApiResult } from '../common/api-result';
import { Page } from '../common/page';
import { UserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { Env } from '../env/env.entity';

@Controller()
export class ServerController {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
  ) {
  }

  @Post('/api/servers/save')
  async save(@Body() dto: ServerDto, @Res() res: Response) {
    const apiResult = new ApiResult();

    if (dto.envId) {
      const env = await this.envRepository.findOne(dto.envId);
      dto.envName = env.name;
    }

    apiResult.result = await this.serverRepository.save(dto);
    return res.json(apiResult);
  }

  @Put('/api/servers/update')
  async update(@Body() dto: ServerDto, @Res() res: Response) {
    const apiResult = new ApiResult();
    if (dto.envId) {
      const env = await this.envRepository.findOne(dto.envId);
      dto.envName = env.name;
    }

    apiResult.result = await this.serverRepository.save(dto);
    return res.json(apiResult);
  }

  @Get('/api/servers/page')
  async page(@Query() dto: ServerDto, @Res() res: Response) {
    const ar = new ApiResult();
    const page = new Page();
    await this.serverRepository.createQueryBuilder('s')
      .skip(ServerDto.getOffset(ServerDto.getPageNo(dto.pageNo), ServerDto.getPageSize(dto.pageSize)))
      .take(ServerDto.getPageSize(dto.pageSize))
      .getManyAndCount()
      .then(value => {
        page.data = value[0];
        page.total = value[1];
      });
    page.pageNo = dto.pageNo;
    page.pageSize = dto.pageSize;
    // 分页总数，总记录数 / 页条数，当存在小数点，使用了 Math.ceil 直接网上取整数
    page.totalPage = Math.ceil(page.total / page.pageSize);
    ar.result = page;
    return res.json(ar);
  }

  @Get('/api/servers/list')
  async list(@Query() dto: ServerDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.serverRepository.find(dto);
    return res.json(ar);
  }

  @Get('/api/servers/info')
  async info(@Query() dto: ServerDto, @Res() res: Response) {
    const ar = new ApiResult();

    const server = await this.serverRepository.findOne(dto.id);
    if (!server) {
      ar.remindRecordNotExist(User.entityName, { id: dto.id });
      return res.json(ar);
    }
    ar.result = server;
    return res.json(ar);
  }

}
