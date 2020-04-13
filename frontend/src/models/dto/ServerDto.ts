import { BaseDto } from '@/models/global';

/**
 * 环境
 */
export interface ServerDto extends BaseDto {
  // 服务器名称
  name?: string;
  // 环境id
  envId?: number;
  // 环境名称
  envName?: string;
  // 内网IP地址
  intranetIp?: string;
  // 公网IP地址
  ip?: string;
  // 是否发布机器，默认否
  isPublish?: boolean;
  // 服务器 ssh 用户名
  sshUsername?: string;
  // 服务器 ssh 密码
  sshPassword?: string;
  // 服务器 ssh 端口
  sshPort?: string;
}
