import { Body, Controller, Delete, Get, HttpException, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Env } from './env.entity';
import { EnvDto } from './env.dto';
import { Page } from '../common/page';
import { ServerDto } from '../server/server.dto';
import { UserAuth, UserAuthOperation } from '../user/user-auth';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class EnvController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    private jwtService: JwtService,
  ) {
  }

  @Post('/api/envs/save')
  async save(@Body() dto: EnvDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.envRepository.save(dto);
    return res.json(ar);
  }

  @Put('/api/envs/update')
  async update(@Body() dto: EnvDto, @Res() res: Response) {
    const ar = new ApiResult();
    let env = await this.envRepository.findOne(dto.id);
    if (!env) {
      ar.remindRecordNotExist(Env.entityName, { id: dto.id });
      return;
    }
    env = dto;
    ar.result = await this.envRepository.save(env);
    return res.json(ar);
  }

  @Delete('/api/envs/delete')
  async delete(@Body() dto: EnvDto, @Req() req, @Res() res: Response) {
    const ar = new ApiResult();

    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    // 非管理员 无权限删除
    if (userAuth.roleType !== 0) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    const env = await this.envRepository.findOne(dto.id);
    if (!env) {
      ar.remindRecordNotExist(Env.entityName, { id: dto.id });
      return res.json(ar);
    }
    await this.envRepository.delete(dto.id);

    return res.json(ar);
  }

  @Get('/api/envs/info')
  async info(@Query() dto: ServerDto, @Res() res: Response) {
    const ar = new ApiResult();

    const env = await this.envRepository.findOne(dto.id);
    if (!env) {
      ar.remindRecordNotExist(Env.entityName, { id: dto.id });
      return res.json(ar);
    }
    ar.result = env;
    return res.json(ar);
  }

  @Get('/api/envs/list')
  async list(@Query() dto: EnvDto, @Res() res: Response) {
    const ar = new ApiResult();
    const envList = await this.envRepository.find(dto);
    ar.result = envList.sort((a, b) => a.sort - b.sort);
    return res.json(ar);
  }

  @Get('/api/envs/page')
  async page(@Query() dto: EnvDto, @Res() res: Response) {

    const ar = new ApiResult();
    const page = new Page();
    await this.envRepository.createQueryBuilder('s')
      .skip(EnvDto.getOffset(EnvDto.getPageNo(dto.pageNo), ServerDto.getPageSize(dto.pageSize)))
      .take(EnvDto.getPageSize(dto.pageSize))
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
}