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
  jobPath: '/jobs', // install_path/jobs （项目工作目录）
  buildPath: '/builds', // installPath/jobs/projectName/builds（构建后文件目录）
  git: '/gits', // installPath/jobs/projectName/gits（项目初始化目录）
  logPath: '/logs', // install_path/logs（日志目录，所有日志，初始化日志、构建日志、同步日志）
};