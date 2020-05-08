import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 用户
 */
export interface UserDto extends BaseDto {

  username: string;
  password: string;
  accessToken: string;
  roleType: 'superAdmin' | 'admin' | 'common';
}


export const USER_KEY = {
  ACCESS_TOKEN: 'access_token', // 用户登录 access_token
  USERNAME: 'username', // 用户登录 username
};
