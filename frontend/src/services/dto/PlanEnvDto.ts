import { BaseDto } from '@/services/dto/BaseDto';
import { PlanEnvProjectConfigDto } from '@/services/dto/PlanEnvProjectConfigDto';

/**
 * 版本计划环境
 */
export interface PlanEnvDto extends BaseDto {

  // 版本计划id
  planId: number;
  // 版本计划名称
  planName: string;
  // 环境id
  envId: number;
  // 环境名称
  envName: string;

  planEnvProjectConfigList: PlanEnvProjectConfigDto[];

}
