import { BaseDto } from '@/models/dto/BaseDto';

/**
 * 用户
 */
export interface UserDto extends BaseDto {
  username: string;
  password: string;
  accessToken: string;
}
