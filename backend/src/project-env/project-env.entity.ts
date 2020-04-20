import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目环境
 */
@Entity()
export class ProjectEnv extends BaseEntity {
  static entityName = 'ProjectEnv';
  @Column({ nullable: true })
  envId: number;
  @Column({ nullable: true })
  envName: string;
  @Column({ nullable: true })
  envSort: number;
  @Column({ nullable: true })
  projectId: number;
  @Column({ nullable: true })
  projectName: string;
  @Column({ nullable: true })
  publishBranch: string;
  @Column({ nullable: true, default: false, comment: '是否可选分支发布，默认否' })
  isSelectBranch: boolean;
  @Column({ nullable: true })
  syncEnvId: number;
  @Column({ nullable: true })
  syncEnvName: string;
  @Column({ nullable: true })
  syncServerId: number;
  @Column({ nullable: true })
  syncServerIp: string;
  @Column({ nullable: true })
  syncServerName: string;
  @Column({ nullable: true, default: 0, comment: '构建序列' })
  buildSeq: number;
}
