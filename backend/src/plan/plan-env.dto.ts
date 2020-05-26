import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';
import { PlanEnv } from './plan-env.entity';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { PlanEnvProjectConfigDto } from './plan-env-project-config.dto';

/**
 * 项目扩展表，用于插件管理
 */
export class PlanEnvDto extends PlanEnv {

  planEnvProjectConfigList: PlanEnvProjectConfigDto[];

}
