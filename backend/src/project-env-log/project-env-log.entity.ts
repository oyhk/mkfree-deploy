import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectEnvLog extends BaseEntity {

  static entityName = 'ProjectEnvLog';

  @Column({ nullable: true, comment: '日志类型，1.项目构建 2.项目同步' })
  type: number;
  @Column({ nullable: true, comment: '项目id' })
  projectId: number;
  @Column({ nullable: true, comment: '项目名称' })
  projectName: string;
  @Column({ nullable: true, comment: '环境id' })
  envId: number;
  @Column({ nullable: true, comment: '项目环境id' })
  projectEnvId: number;
  @Column({ nullable: true, comment: '项目环境日志序号' })
  projectEnvLogSeq: number;
  @Column({ default: 0, nullable: true, comment: '日志是否输出完成，默认：否' })
  isFinish: boolean;
}

export const ProjectEnvLogType = {
  build: { code: 1, desc: '构建' },// 项目构建
  sync: { code: 2, desc: '同步' },// 项目同步

  getDesc: (code) => {
    let desc = '';
    if (code === 1) {
      desc = ProjectEnvLogType.build.desc;
    } else if (code === 2) {
      desc = ProjectEnvLogType.sync.desc;
    }
    return desc;
  },
};
