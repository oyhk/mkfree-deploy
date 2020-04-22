import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectEnvLog extends BaseEntity {

  @Column({ nullable: true, comment: '日志类型，1.项目构建 2.项目同步' })
  type: number;
  @Column({ nullable: true, comment: '项目id' })
  projectId: number;
  @Column({ nullable: true, comment: '环境id' })
  envId: number;
  @Column({ nullable: true, comment: '项目环境id' })
  projectEnvId: number;
  @Column({ nullable: true, comment: '项目环境日志序号' })
  projectEnvLogSeq: number;
}

export const ProjectEnvLogType = {
  build: 1,// 项目构建
  sync: 2,// 项目同步
};