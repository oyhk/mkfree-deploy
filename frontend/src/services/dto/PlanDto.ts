import { BaseDto } from '@/services/dto/BaseDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';
import { PlanScriptDto } from '@/services/dto/PlanScriptDto';

/**
 * 版本计划
 */
export interface PlanDto extends BaseDto {
  // 名称
  name?: string;
  // 版本脚本列表
  planScriptList: PlanScriptDto[];
  // 版本计划环境列表
  planEnvList: PlanEnvDto[];

}
