import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';
import { PlanEnv } from './plan-env.entity';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { PlanScript } from './plan-script.entity';

/**
 * 版本计划脚本
 */
export class PlanScriptDto extends PlanScript {

}
