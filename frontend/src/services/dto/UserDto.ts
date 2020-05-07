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

/**
 * 用户登录后 access_token key
 */
export const ACCESS_TOKEN_KEY = 'access_token';
/**
 * 用户名 key
 */
export const USERNAME = 'username';
