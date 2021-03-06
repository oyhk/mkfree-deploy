import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

@Entity()
export class Project extends BaseEntity {

  static entityName = 'Project';

  @Column({ unique: true, comment: '项目名称' })
  name: string;
  @Column({ nullable: true, comment: '分支列表' })
  branchList: string;
  @Column({ nullable: true, comment: 'git仓库Url' })
  gitUrl: string;
  @Column({ nullable: true, comment: '部署项目模块的名称' })
  moduleName: string;
  @Column({ nullable: true, comment: '项目标签Id，用于标签分类' })
  projectTagId: number;
  @Column({ nullable: true, comment: '项目标签名称' })
  projectTagName: string;
  @Column({ nullable: true, comment: '项目系统路径' })
  systemPath: string;
  @Column({ nullable: true, comment: '远程服务器项目路劲' })
  remotePath: string;
  @Column({ default: 1, comment: '项目状态' })
  state: number;
  @Column({ default: 0, comment: '初始化日志序号' })
  initLogSeq: number;
}

/**
 * 项目状态
 */
export const ProjectState = {
  new: 1, // 新建
  success: 2, // 初始化成功
  fail: 3, // 初始化失败
};

/**
 * 项目日志类型
 */
export const ProjectLogFileType = {
  init: (seq) => `init-${seq}.log`,
  build: (envCode,seq) => `build-${envCode}-${seq}.log`,
};