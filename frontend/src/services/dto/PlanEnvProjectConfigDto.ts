import { BaseDto } from '@/services/dto/BaseDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';
import { PlanEnvProjectConfigServerDto } from '@/services/dto/PlanEnvProjectConfigServerDto';

/**
 * 版本计划环境项目配置
 */
export interface PlanEnvProjectConfigDto extends BaseDto {
  // 版本计划id
  planId?: number;
  // 版本计划名称
  planName?: string;
  // 计划环境id
  planEnvId?: number;
  // 计划环境名称
  planEnvName?: string;
  // common（公共配置）、project（项目配置）
  type?: number;
  // 项目id，当type为common时，projectId为空
  projectId?:number;
  // 项目名称
  projectName?:string;
  // 项目排序
  projectSort?:number;
  // 发布分支名
  publishBranch?: string;
  // 发布服务器id
  publishServerId?: string;
  // 发布服务器名称
  publishServerName?: string;
  // 灰度服务器ID列表
  grayServerIdList?: number[];
  grayServerList?: PlanEnvProjectConfigServerDto[];
  // 正式服务器ID列表
  releaseServerIdList?: number[];
  releaseServerList?: PlanEnvProjectConfigServerDto[];

  // 是否开启自定义配置
  isEnableCustomConfig?:boolean;
}


export const PlanEnvProjectConfigType = {
  common: {
    code: 1,
    desc: '公共配置',
  },
  project: {
    code: 2,
    desc: '项目配置',
  },
};
