import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class Server extends BaseEntity {

  @Column({ nullable: true, comment: '环境id' })
  envId: number;
  @Column({ nullable: true, comment: '环境名称' })
  envName: string;
  @Column({ nullable: true, unique: true, comment: '内网IP地址' })
  intranetIp: string;
  @Column({ nullable: true, unique: true, comment: '公网IP地址' })
  ip: string;
  @Column({ nullable: true, default: false, comment: '是否发布机器，默认否' })
  isPublish: boolean;
  @Column({ nullable: true, comment: '服务器名称' })
  name: string;
  @Column({ nullable: true, comment: '服务器 ssh 用户名' })
  sshUsername: string;
  @Column({ nullable: true, comment: '服务器 ssh 密码' })
  sshPassword: string;
  @Column({ nullable: true, comment: '服务器 ssh 端口' })
  sshPort: string;
}