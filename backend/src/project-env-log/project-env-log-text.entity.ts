import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectEnvLogText extends BaseEntity {

  @Column({ comment: '日志内容' })
  text: string;
  @Column({ comment: '项目环境日志id' })
  projectEnvLogId: number;
}