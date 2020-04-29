import { BaseDto } from '@/services/dto/BaseDto';
import { ProjectBuildStepDto } from '@/services/dto/ProjectBuildStepDto';
import { ProjectEnvServerDto } from '@/services/dto/ProjectEnvServerDto';
import { ProjectEnvLogDto } from '@/services/dto/ProjectEnvLogDto';
import { ProjectEnvPlugin } from '@/services/dto/ProjectEnvPluginDto';

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

  // 项目环境插件
  projectEnvPluginList?: ProjectEnvPlugin[];
}
