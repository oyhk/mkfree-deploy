import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResultCode, ApiResult } from '../common/api-result';
import { Response } from 'express';
import { ProjectEnv } from './project-env.entity';

@Controller()
export class ProjectEnvController {

  constructor(
    @InjectRepository(ProjectEnv)
    private projectEnvLogRepository: Repository<ProjectEnv>,
  ) {
  }


  @Get('/api/projectEnvs/list')
  async list(@Query() dto: ProjectEnv, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectEnvLogRepository.createQueryBuilder('p')
      .where('p.projectId = :projectId ', {
        projectId: dto.projectId,
      }).addOrderBy('envSort', 'ASC').limit(5).getMany();
    return res.json(ar);
  }


}
