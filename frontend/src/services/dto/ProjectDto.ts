import { BaseDto } from '@/services/dto/BaseDto';
import { ProjectEnvDto } from '@/services/dto/ProjectEnvDto';
import { ProjectDeployFileDto } from '@/services/dto/ProjectDeployFileDto';
import { ProjectPluginDto } from '@/services/dto/ProjectPluginDto';

/**
 * 项目
 */
export interface ProjectDto extends BaseDto {
  name?: string;
  branchList?: string;
  buildLogSeqNo?: number;
  projectTagId?: number;
  projectTagName?: string;
  gitUrl?: string;
  remotePath?: string;
  moduleName?: string;
  state: number;

  projectDeployFileList?: ProjectDeployFileDto[];
  projectEnvList?: ProjectEnvDto[];

  projectPluginList: ProjectPluginDto[];

}
