import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Exclude, Expose } from 'class-transformer';
import * as crypto from 'crypto';

/**
 * 发布环境
 */
@Entity()
export class Env extends BaseEntity {

  static entityName = 'Env';

  @Column({ comment: '环境编码' })
  code: string;
  @Column({ nullable: true, default: true, comment: '环境编码，默认启用' })
  enable: boolean;
  @Column({ nullable: true, comment: '环境名称' })
  name: string;
  @Column({ nullable: true, default: 0, comment: '排序，降序排序' })
  sort: number;
}
