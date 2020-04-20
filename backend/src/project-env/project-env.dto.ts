import { ProjectEnv } from './project-env.entity';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';

/**
 * 项目环境
 */
export class ProjectEnvDto extends ProjectEnv {

  projectEnvServerList: ProjectEnvServerDto[];
  projectCommandStepBuildList: ProjectCommandStep[];
  projectCommandStepBuildAfterList: ProjectCommandStep[];
  projectCommandStepSyncAfterList: ProjectCommandStep[];
}
