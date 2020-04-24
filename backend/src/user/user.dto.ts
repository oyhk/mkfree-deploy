import { User } from './user.entity';
import { Column } from 'typeorm';

/**
 * 用户dto
 */
export class UserDto extends User {

  idList: number[];

  accessToken: string;


}