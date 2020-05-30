import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

/**
 * 版本计划
 */
@Entity()
export class PlanProjectSort extends BaseEntity {

  static entityName = 'PlanProjectSort';

  @Column({ unique: true, comment: '项目id' })
  projectId: number;
  @Column({ comment: '项目名称' })
  projectName: string;
  @Column({ comment: '项目排序' })
  sort: number;

}
