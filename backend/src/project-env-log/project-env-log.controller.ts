import {
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResultCode, ApiResult } from '../common/api-result';
import { ProjectEnvLog, ProjectEnvLogType } from './project-env-log.entity';
import { UserDto } from '../user/user.dto';
import { Response } from 'express';
import * as fs from 'fs';
import { SystemConfig, SystemConfigKeys, SystemConfigValues } from '../system-config/system-config.entity';
import { Project, ProjectLogFileType } from 'src/project/project.entity';
import { ProjectEnv } from 'src/project-env/project-env.entity';
import { Env } from '../env/env.entity';
import { ProjectEnvLogDto } from './project-env-log.dto';

@Controller()
export class ProjectEnvLogController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectEnv)
    private projectEnvRepository: Repository<ProjectEnv>,
    @InjectRepository(ProjectEnvLog)
    private projectEnvLogRepository: Repository<ProjectEnvLog>,
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
  ) {
  }


  @Get('/api/projectEnvLogs/list')
  async list(@Query() dto: ProjectEnvLog, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectEnvLogRepository.createQueryBuilder('p')
      .where('p.projectId = :projectId and p.envId = :envId', {
        projectId: dto.projectId,
        envId: dto.envId,
      }).addOrderBy('projectEnvLogSeq', 'DESC').limit(15).getMany();
    return res.json(ar);
  }

  @Get('/api/projectEnvLogs/info')
  async info(@Query() dto: ProjectEnvLog, @Res() res: Response) {
    const ar = new ApiResult();
    const projectEnvLog = await this.projectEnvLogRepository.findOne({
      projectId: dto.projectId,
      envId: dto.envId,
      projectEnvLogSeq: dto.projectEnvLogSeq,

    });
    if (!projectEnvLog) {
      ar.remindRecordNotExist(ProjectEnvLog.entityName, dto.projectEnvLogSeq);
      return res.json(ar);
    }
    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });
    const env = await this.envRepository.findOne(projectEnvLog.envId);
    const project = await this.projectRepository.findOne(projectEnvLog.projectId);
    const projectEnvLogDto = projectEnvLog as ProjectEnvLogDto;
    projectEnvLogDto.typeDesc = ProjectEnvLogType.getDesc(projectEnvLog.type);
    projectEnvLogDto.text = fs.readFileSync(`${installPathSystemConfig.value}${SystemConfigValues.logPath}/${project.name}/${ProjectLogFileType.build(env.code, projectEnvLog.projectEnvLogSeq)}`,
      {
        encoding: 'utf8',
        flag: 'r',
      })
      .replace(/(Operation timed out)/g, '<span style="color: #ffffff;background-color: #FF0000;padding: 3px">Operation timed out</span>')
      .replace(/(No such file or directory)/g, '<span style="color: #ffffff;background-color: #FF0000;padding: 3px">No such file or directory</span>')
      .replace(/(Failed)/g, '<span style="color: #ffffff;background-color: #FF0000;padding: 3px">Failed</span>')
      .replace(/(ERROR)/g, '<span style="color: #ffffff;background-color: #FF0000;padding: 3px">ERROR</span>')
      .replace(/(warning)/g, '<span style="color: #ffffff;background-color: #faad14;padding: 3px">warning</span>')
      .replace(/(WARNING)/g, '<span style="color: #ffffff;background-color: #faad14;padding: 3px">WARNING</span>')
      .replace(/(cannot)/g, '<span style="color: #ffffff;background-color: #faad14;padding: 3px">cannot</span>')

      .replace(/(?:\r\n|\r|\n)/g, '<br/>');

    ar.result = projectEnvLogDto;
    return res.json(ar);
  }

}
