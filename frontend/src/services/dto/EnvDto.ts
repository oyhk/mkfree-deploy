import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 环境
 */
export interface EnvDto extends BaseDto {
  // 环境编码
  code?: string;
  // 环境编码，默认启用
  isEnable?: boolean;
  // 环境名称
  name?: string;
  // 排序，降序排序
  sort?: number;
}
