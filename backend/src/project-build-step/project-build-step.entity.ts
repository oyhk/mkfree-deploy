import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class ProjectBuildStep extends BaseEntity {
  @Column({ nullable: true })
  envId: number;
  @Column({ nullable: true })
  projectId: number;
  @Column({ nullable: true })
  projectName: string;
  @Column({ nullable: true })
  step:string;
  @Column({ nullable: true })
  type:number;
}