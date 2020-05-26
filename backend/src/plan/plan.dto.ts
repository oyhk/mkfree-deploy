import { BaseEntity } from '../common/base.entity';
import { Plan } from './plan.entity';
import { PlanEnvDto } from './plan-env.dto';
import { PlanScriptDto } from './plan-script.dto';

export class PlanDto extends Plan{

  // 版本计划环境列表
  planEnvList:PlanEnvDto[];
  // 版本脚本列表
  planScriptList: PlanScriptDto[];

}