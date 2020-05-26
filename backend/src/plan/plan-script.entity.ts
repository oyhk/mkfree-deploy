import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 版本计划脚本
 */
@Entity()
export class PlanScript extends BaseEntity {

  static entityName = 'PlanScript';

  @Column({ nullable: true, comment: '版本计划id' })
  planId: number;
  @Column({ nullable: true, comment: '版本计划名称' })
  planName: string;

  @Column({ nullable: true, comment: '脚本内容' })
  text: string;
  @Column({ nullable: true, comment: '用户id' })
  userId: number;
  @Column({ nullable: true, comment: '用户名' })
  username:string;

}
