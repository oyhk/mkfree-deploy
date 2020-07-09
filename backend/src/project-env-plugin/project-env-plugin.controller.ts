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
import { ProjectEnvPlugin } from './project-env-plugin.entity';

@Controller()
export class ProjectEnvPluginController {

  constructor(
    @InjectRepository(ProjectEnvPlugin)
    private projectEnvPluginRepository: Repository<ProjectEnvPlugin>,
  ) {
  }


  @Get('/api/projectEnvPlugins/info')
  async info(@Query() dto: ProjectEnvPlugin, @Res() res: Response) {
    const ar = new ApiResult();
    const projectEnv = await this.projectEnvPluginRepository.findOne({ projectId: dto.projectId, envId: dto.envId });
    if (!projectEnv) {
      ar.remindRecordNotExist(ProjectEnvPlugin.entityName, { projectId: dto.projectId, envId: dto.envId });
      return res.json(ar);
    }
    ar.result = projectEnv;
    return res.json(ar);
  }

  @Get('/api/projectEnvPlugins/list')
  async list(@Query() dto: ProjectEnvPlugin, @Res() res: Response) {
    const ar = new ApiResult();
    const projectEnv = await this.projectEnvPluginRepository.find();
    if (!projectEnv) {
      ar.remindRecordNotExist(ProjectEnvPlugin.entityName, { projectId: dto.projectId, envId: dto.envId });
      return res.json(ar);
    }
    ar.result = projectEnv;
    return res.json(ar);
  }

}