import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as moment from 'moment';

/**
 * BaseEntity 作为Entity基类，提供默认属性
 */
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // @Exclude()
  @CreateDateColumn({ })
  createdAt: Date;

  // @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  // 分页字段
  pageNo: number;
  pageSize: number;

  static getPageNo(pageNo) {
    if (!pageNo) {
      pageNo = 0;
    } else {
      pageNo = pageNo > 0 ? pageNo - 1 : 0;
    }
    return pageNo;
  }

  static getOffset(pageNo, pageSize) {
    return pageNo * pageSize;

  }

  static getPageSize(pageSize) {
    if (!pageSize) {
      pageSize = 10;
    }
    return pageSize;
  }
}