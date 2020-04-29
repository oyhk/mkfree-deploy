import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 用户
 */
export interface UserDto extends BaseDto {
  username: string;
  password: string;
  accessToken: string;
}
