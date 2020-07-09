import { Column, Entity, TableIndex } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 插件环境配置
 */
@Entity()
export class PluginEnvSetting extends BaseEntity {

  static entityName = 'PluginEnvSetting';

  @Column({ comment: '环境id' })
  envId: number;
  @Column({ nullable:true, comment: '环境名称' })
  envName: string;
  @Column({ comment: '插件名称' })
  pluginName: string;
  @Column({ nullable: true, comment: '配置信息，这里使用json结构，方便扩展' })
  config: string;
  @Column({ default: false, comment: '是否默认显示' })
  defaultShow: boolean;

}