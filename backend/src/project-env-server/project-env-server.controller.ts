import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEnvServer } from './project-env-server.entity';
import { ProjectEnvServerDto } from './project-env-server.dto';

@Controller()
export class ProjectEnvServerController {

  constructor(
    @InjectRepository(ProjectEnvServer)
    private projectEnvServerRepository: Repository<ProjectEnvServer>,
  ) {
  }


  @Get('/api/projectEnvServers/list')
  async list(@Query() dto: ProjectEnvServerDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectEnvServerRepository.find({
      projectId: dto.projectId,
      envId: dto.envId,
    });
    return res.json(ar);
  }




}




