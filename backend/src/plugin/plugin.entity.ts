import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class Plugin extends BaseEntity {

  static entityName = 'Plugin';

  @Column({ unique: true, comment: '名称' })
  name: string;
  @Column({ comment: '类型' })
  type: number;

}

export const PluginType = {
  project: 1, // 项目插件
};
/**
 * 插件 code 种类
 */
export const PluginName = {
  Eureka: 'Eureka',
  Nacos: 'Nacos',
};
