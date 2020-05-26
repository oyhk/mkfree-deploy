import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';

/**
 * 项目扩展表，用于插件管理
 */
export class PlanEnvProjectConfigDto extends PlanEnvProjectConfig {
  // 灰度版服务器ID列表
  garyServerIdList: number[];
  // 正式版服务器ID列表
  releaseServerIdList: number[];

}