import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class PlanEnvProjectConfigServer extends BaseEntity {

  static entityName = 'PlanEnvProjectConfigServer';

  @Column({ comment: '项目环境项目配置id' })
  planEnvProjectConfigId: number;
  @Column({ comment: '项目环境项目配置服务器id' })
  serverId: number;
  @Column({ comment: '项目环境项目配置服务器类型，1 灰度服务器 2 正式服务器' })
  type:number;
}


export const PlanEnvProjectConfigServerType = {
  gray:{
    code:1,
    desc:'灰度服务器'
  },
  release:{
    code:2,
    desc:'正式服务器'
  }
};