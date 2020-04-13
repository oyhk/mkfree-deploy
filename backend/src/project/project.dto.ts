import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { Project } from './project.entity';
import { ProjectEnvDto } from '../project-env/project-env.dto';
import { ProjectBuildStep } from '../project-build-step/project-build-step.entity';


/**
 * 项目DTO
 */
export class ProjectDto extends Project {

  /**
   * 项目部署文件
   */
  projectDeployFileList: ProjectDeployFile[];
  projectEnvList: ProjectEnvDto[];


}