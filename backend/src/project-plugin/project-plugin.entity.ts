import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class ProjectPlugin extends BaseEntity {

  static entityName = 'ProjectPlugin';

  @Column({ comment: '项目id' })
  projectId: number;
  @Column({ nullable: true, comment: '插件名称，唯一标识' })
  pluginName: string;
  @Column({ nullable: true, default: 0, comment: '是否开启,默认否' })
  pluginIsEnable: boolean;
}

