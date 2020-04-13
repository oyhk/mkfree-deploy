import { ProjectEnv } from './project-env.entity';
import { ProjectBuildStep } from '../project-build-step/project-build-step.entity';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';

/**
 * 项目环境
 */
export class ProjectEnvDto extends ProjectEnv {

  projectEnvServerList: ProjectEnvServerDto[];
  projectBuildBeforeList: ProjectBuildStep[];
  projectBuildAfterList: ProjectBuildStep[];
  projectSyncAfterList: ProjectBuildStep[];
}
