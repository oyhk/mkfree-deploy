import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

/**
 * 项目环境服务器
 */
@Entity()
export class ProjectEnvServer extends BaseEntity {
  static entityName = 'ProjectEnvServer';

  @Column({ nullable: true })
  envId: number;
  @Column({ nullable: true })
  envName: string;
  @Column({ nullable: true })
  projectId: number;
  @Column({ nullable: true })
  projectName: string;
  @Column({ nullable: true, default: false, comment: '是否为发布服务器，默认否' })
  isPublish: boolean;
  @Column({ nullable: true })
  publishTime: Date;
  @Column({ nullable: true })
  publishVersion: string;
  @Column({ nullable: true })
  serverId: number;
  @Column({ nullable: true })
  serverIp: string;
  @Column({ nullable: true })
  serverName: string;
}
