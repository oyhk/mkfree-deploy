import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Exclude, Expose } from 'class-transformer';
import * as crypto from 'crypto';


/**
 * 系统配置
 *
 * 这里使用树表的方式保存配置
 */
@Entity()
export class SystemConfig extends BaseEntity {


  @Column({ unique: true, comment: '配置key' })
  key: string;

  @Column({ comment: '配置value' })
  value: string;
}

export const SystemConfigKeys = {
  installPath: 'install_path',
  jobPath: 'job_path',
  buildPath: 'build_path',
};
