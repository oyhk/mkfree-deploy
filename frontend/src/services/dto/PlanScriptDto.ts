import { BaseDto } from '@/services/dto/BaseDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';

/**
 * 版本计划脚本
 */
export interface PlanScriptDto extends BaseDto {
  // 版本计划id
  planId?: number;
  // 版本计划名称
  planName?: string;
  // 脚本内容
  text?: string;
  // 用户id
  userId?: number|null|string;
  // 用户名
  username?: string|null;
}
