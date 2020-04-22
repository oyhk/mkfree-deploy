import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

/**
 * 项目环境服务器
 */
@Entity()
export class ProjectEnvServer extends BaseEntity {
  static entityName = 'ProjectEnvServer';

  @Column({ nullable: true, comment: '环境id' })
  envId: number;
  @Column({ nullable: true, comment: '环境名称' })
  envName: string;
  @Column({ nullable: true, comment: '项目id' })
  projectId: number;
  @Column({ nullable: true, comment: '项目名称' })
  projectName: string;
  @Column({ nullable: true, default: false, comment: '是否为发布服务器，默认否' })
  isPublish: boolean;
  @Column({ nullable: true, comment: '发布时间' })
  publishTime: Date;
  @Column({ nullable: true, comment: '发布版本' })
  publishVersion: string;
  @Column({ nullable: true, comment: '服务器id' })
  serverId:number;
  @Column({ nullable: true, comment: '服务器ip' })
  serverIp:string;
  @Column({ nullable: true, comment: '服务器名称' })
  serverName:string;

}
