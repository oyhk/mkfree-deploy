import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 版本计划
 */
@Entity()
export class Plan extends BaseEntity {

  static entityName = 'Plan';
  @Column({ nullable: true, comment: '版本计划 名称' })
  name: string;
  @Column({ nullable: true, comment: '版本计划 发布版本' })
  publishVersion: string;

}
