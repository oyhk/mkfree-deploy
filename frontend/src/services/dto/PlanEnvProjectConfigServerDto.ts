import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 版本计划项目配置服务器
 */
export interface PlanEnvProjectConfigServerDto extends BaseDto {

  //版本计划id
  planId: number;
  //项目环境项目配置 id
  planEnvProjectConfigId: number;
  // 项目环境项目配置服务器 id
  serverId: number;
  // 项目环境项目配置服务器 名称
  serverName: string;
  // 项目环境项目配置服务器类型，1 灰度服务器 2 正式服务器
  type: number;
}


export const PlanEnvProjectConfigServerType = {
  gray: {
    code: 1,
    desc: '灰度服务器',
  },
  release: {
    code: 2,
    desc: '正式服务器',
  },
};
