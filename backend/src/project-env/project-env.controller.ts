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
    private projectEnvRepository: Repository<ProjectEnv>,
  ) {
  }


  @Get('/api/projectEnvs/list')
  async list(@Query() dto: ProjectEnv, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectEnvRepository.createQueryBuilder('p')
      .where('p.projectId = :projectId ', {
        projectId: dto.projectId,
      }).addOrderBy('envSort', 'ASC').getMany();
    return res.json(ar);
  }

  @Get('/api/projectEnvs/info')
  async info(@Query() dto: ProjectEnv, @Res() res: Response) {
    const ar = new ApiResult();
    const projectEnv = await this.projectEnvRepository.findOne({ projectId: dto.projectId, envId: dto.envId });
    if (!projectEnv) {
      ar.remindRecordNotExist(ProjectEnv.entityName, { projectId: dto.projectId, envId: dto.envId });
      return res.json(ar);
    }
    ar.result = projectEnv;
    return res.json(ar);
  }


}
