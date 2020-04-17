import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectLogText extends BaseEntity {

  @Column({ comment: '日志内容' })
  text: string;
  @Column({ comment: '项目日志id' })
  projectLogId:number;
}