import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Exclude, Expose } from 'class-transformer';
import * as crypto from "crypto";


@Entity()
export class User extends BaseEntity {

  @Column({unique:true})
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  @Exclude()
  passwordSalt: string;
  @Column()
  roleType: number;
  @Column({nullable:true})
  @Exclude()
  accessToken: string;


  /**
   * 加密顺序 md5(passwordSalt + password)
   * @param passwordSalt
   * @param password
   */
  static getMd5Password(passwordSalt: string, password: string): string {
    return crypto.createHash('md5').update(passwordSalt + password).digest('hex');
  }
}

interface UserRoleType {
  [roleType: number]: string;
}