import { BaseDto } from '@/models/global';

/**
 * 项目环境服务器
 */
export interface ProjectEnvServerDto extends BaseDto {
  envId?: number;
  envName?: string;
  projectId?: number;
  projectName?: string;
  isPublish?: boolean;
  publishTime?: string;
  publishVersion?: string;
  serverId?: number;
  serverIp?: string;
  // 用于选中服务器的标识，由于api返回没有这个字段，前端需要选中
  isSelectServerIp?: boolean;
  serverName?: string;
}
