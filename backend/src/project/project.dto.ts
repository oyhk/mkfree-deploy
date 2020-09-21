import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { Project } from './project.entity';
import { ProjectEnvDto } from '../project-env/project-env.dto';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { ProjectPlugin } from '../project-plugin/project-plugin.entity';


/**
 * 项目DTO
 */
export class ProjectDto extends Project {

  /**
   * 项目部署文件列表
   */
  projectDeployFileList?: ProjectDeployFile[];
  /**
   * 部署环境列表
   */
  projectEnvList?: ProjectEnvDto[];

  /**
   * 项目环境id
   */
  projectEnvId: number;
  /**
   * 同步服务器id
   */
  syncServerId:number;


  /**
   * 环境id
   */
  envId:number;
  /**
   * 项目环境服务器id
   */
  projectEnvServerId: number;
  /**
   * 项目环境服务器发布分支名称
   */
  projectEnvServerPublishBranch: string;


  /**
   * 项目插件
   */
  projectPluginList: ProjectPlugin[];

}