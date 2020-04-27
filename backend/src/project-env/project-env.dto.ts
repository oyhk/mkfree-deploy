import { ProjectEnv } from './project-env.entity';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';
import { ProjectEnvPlugin } from '../project-dev-plugin/project-env-plugin.entity';

/**
 * 项目环境
 */
export class ProjectEnvDto extends ProjectEnv {

  projectEnvServerList: ProjectEnvServerDto[];
  projectCommandStepBuildList: ProjectCommandStep[];
  projectCommandStepBuildAfterList: ProjectCommandStep[];
  projectCommandStepSyncAfterList: ProjectCommandStep[];

  projectEnvPluginList: ProjectEnvPlugin[];
}
