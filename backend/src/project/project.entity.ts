import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class Project extends BaseEntity {

  @Column({ unique: true, comment: '项目名称' })
  name: string;
  @Column({ nullable: true, comment: '分支列表' })
  branchList: string;
  @Column({ nullable: true, comment: 'git仓库Url' })
  gitUrl: string;
  @Column({ nullable: true, comment: '部署项目模块的名称' })
  moduleName: string;
  @Column({ nullable: true, comment: '项目标签Id，用于标签分类' })
  projectTagId: number;
  @Column({ nullable: true, comment: '项目标签名称' })
  projectTagName: string;
  @Column({ nullable: true, comment: '项目系统路径' })
  systemPath: string;
  @Column({ nullable: true, comment: '远程服务器项目路劲' })
  remotePath: string;
}