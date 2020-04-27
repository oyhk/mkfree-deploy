import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';

/**
 * 项目扩展表，用于插件管理
 */
@Entity()
export class ProjectEnvPlugin extends BaseEntity {

  static entityName = 'ProjectEnvPlugin';

  @Column({ comment: '项目id' })
  projectId: number;
  @Column({ comment: '环境id' })
  envId: number;
  @Column({ nullable: true, comment: '插件名称，唯一标识' })
  pluginName: string;

  // eureka start
  @Column({ nullable: true, comment: 'eureka 网关' })
  eurekaUrl: string;
  @Column({ nullable: true, comment: 'eureka 认证方式' })
  eurekaAuthType: string;
  @Column({ nullable: true, comment: 'eureka 用户名' })
  eurekaUsername: string;
  @Column({ nullable: true, comment: 'eureka 密码' })
  eurekaPassword: string;
  // eureka end

}

