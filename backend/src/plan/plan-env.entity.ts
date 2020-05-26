import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class PlanEnv extends BaseEntity {

  static entityName = 'PlanEnv';

  @Column({ comment: '版本计划id' })
  planId: number;
  @Column({ comment: '版本计划名称' })
  planName: string;
  @Column({ comment: '环境id' })
  envId: number;
  @Column({ comment: '环境名称' })
  envName: string;

}
