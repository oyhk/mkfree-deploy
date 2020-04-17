import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectLog extends BaseEntity {

  @Column({ comment: '项目id' })
  projectId: number;
  @Column({ comment: '项目日志序号' })
  projectInitLogSeq: number;
  @Column({ comment: '类型' })
  type: number;
}

export const ProjectLogType = {
  init: 1, // 初始化日志
};
