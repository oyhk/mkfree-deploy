import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Env } from './env.entity';
import { EnvDto } from './env.dto';

@Controller()
export class EnvController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
  ) {
  }

  @Post('/api/envs/save')
  async save(@Body() dto: EnvDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.envRepository.save(dto);
    return res.json(ar);
  }

  @Get('/api/envs/list')
  async list(@Query() dto: EnvDto, @Res() res: Response) {
    const ar = new ApiResult();
    const envList = await this.envRepository.find(dto);
    ar.result = envList.sort((a, b) => a.sort - b.sort);
    return res.json(ar);
  }
}