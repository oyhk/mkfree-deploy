import { BaseDto } from '@/models/dto/BaseDto';
import { ProjectEnvDto } from '@/models/dto/ProjectEnvDto';
import { ProjectDeployFileDto } from '@/models/dto/ProjectDeployFileDto';

/**
 * 项目
 */
export interface ProjectDto extends BaseDto {
  name: string;
  branchList: string;
  buildLogSeqNo: number;
  projectTagId: number;
  projectTagName: string;
  gitUrl: string;
  remotePath: string;
  moduleName: string;

  projectDeployFileList: ProjectDeployFileDto[];
  projectEnvList: ProjectEnvDto[];
}
