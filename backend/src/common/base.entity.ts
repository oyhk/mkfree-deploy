import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as moment from 'moment';

/**
 * BaseEntity 作为Entity基类，提供默认属性
 */
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  // 分页字段
  pageNo: number;
  pageSize: number;

  @Expose()
  get createdAtText(): string {
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }
}