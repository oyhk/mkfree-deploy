import { BaseDto } from '@/services/dto/BaseDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';
import { PlanScriptDto } from '@/services/dto/PlanScriptDto';

/**
 * 版本计划项目排序
 */
export interface PlanProjectSortDto extends BaseDto {
  // 项目id
  projectId: number;
  // 项目名称
  projectName: string;
  // 项目排序
  sort: number;

}
