import { BaseDto } from '@/models/dto/BaseDto';
import { ProjectBuildStepDto } from '@/models/dto/ProjectBuildStepDto';
import { ProjectEnvServerDto } from '@/models/dto/ProjectEnvServerDto';
import { ProjectEnvLogDto } from '@/models/dto/ProjectEnvLogDto';

/**
 * 项目环境
 */
export interface ProjectEnvDto extends BaseDto {
  envId?: number;
  envName?: string;
  envSort?: number;
  projectId?: number;
  projectName?: string;
  publishBranch?: string;
  isSelectBranch?: boolean;
  syncEnvId?: number;
  syncEnvName?: string;
  syncServerId?: number;
  syncServerIp?: string;
  syncServerName?: string;

  projectEnvServerList?: ProjectEnvServerDto[];
  projectCommandStepBuildList?: ProjectBuildStepDto[];
  projectCommandStepBuildAfterList?: ProjectBuildStepDto[];
  projectCommandStepSyncAfterList?: ProjectBuildStepDto[];

  // 项目环境日志
  projectEnvLogList?: ProjectEnvLogDto[];
}
