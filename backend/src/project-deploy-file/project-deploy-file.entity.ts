import { BaseEntity } from '../common/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * 项目部署文件
 */
@Entity()
export class ProjectDeployFile extends BaseEntity {
  @Column({ comment: '项目 id' })
  projectId: number;
  @Column({ comment: '项目名称' })
  projectName: string;
  @Column({ default: false, comment: '是否开启，默认关闭' })
  isEnable: boolean;
  @Column({ nullable: true, comment: '本地服务器文件路径' })
  localFilePath: string;
  @Column({ nullable: true, comment: '远程服务器文件路径' })
  remoteFilePath: string;
}