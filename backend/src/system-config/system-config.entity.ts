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
  installPath: 'installPath',
};

export const SystemConfigValues = {
  jobPath: '/jobs', // install_path/jobs （工作目录）
  logPath: '/logs', // install_path/logs（日志目录）
  buildPath:'/builds' // install_path/builds （构建后目录）
};