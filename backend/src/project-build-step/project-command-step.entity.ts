import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectCommandStep extends BaseEntity {
  @Column({ nullable: true })
  envId: number;
  @Column({ nullable: true })
  projectId: number;
  @Column({ nullable: true })
  step: string;
  @Column({ nullable: true })
  type: number;
}

/**
 * 项目命令执行步骤类型
 */
export const ProjectCommandStepType = {
  build: 1, // 构建命令
  buildAfter: 2, //构建后命令
  sync: 3, // 同步后命令
};