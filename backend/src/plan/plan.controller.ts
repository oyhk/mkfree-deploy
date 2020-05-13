import { Body, Controller, Delete, Get, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Env } from '../env/env.entity';
import { PlanDto } from './plan.dto';
import { Project } from '../project/project.entity';

@Controller()
export class PlanController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private jwtService: JwtService,
  ) {
  }

  @Get('/api/plans/project-list')
  async list(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    const projectList = await this.projectRepository.createQueryBuilder('p').select(['p.id', 'p.name']).getMany();
    ar.result = projectList;
    return res.json(ar);
  }


}