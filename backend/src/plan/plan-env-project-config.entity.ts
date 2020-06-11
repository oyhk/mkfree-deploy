import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class PlanEnvProjectConfig extends BaseEntity {

  static entityName = 'PlanEnvProjectConfig';

  @Column({ comment: '版本计划id' })
  planId: number;
  @Column({ comment: '版本计划名称' })
  planName: string;
  @Column({ comment: '计划环境id' })
  planEnvId: number;
  @Column({ comment: '计划环境名称' })
  planEnvName: string;
  @Column({ comment: '1（公共配置）、2（项目配置）' })
  type: number;
  @Column({nullable:true, comment: '是否开启自定义配置' })
  isEnableCustomConfig: boolean;
  @Column({nullable:true, default: 0, comment: '项目id，当type为 1 时，projectId 为 0' })
  projectId: number;
  @Column({nullable:true, comment: '项目名称' })
  projectName: string;
  @Column({nullable:true, comment: '项目排序' })
  projectSort:number;
  @Column({nullable:true, comment: '发布分支名' })
  publishBranch: string;
  @Column({nullable:true, comment: '发布服务器id' })
  publishServerId: string;


}

export const PlanEnvProjectConfigType = {
  common: {
    code: 1,
    desc: '公共配置',
  },
  project: {
    code: 2,
    desc: '项目配置',
  },
};
