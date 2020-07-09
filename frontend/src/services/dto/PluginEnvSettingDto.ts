import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 插件环境配置
 */
export interface PluginEnvSettingDto extends BaseDto {
  // 环境id
  envId: number;
  // 环境名称
  envName:string;
  // 插件名称
  pluginName: string;
  // 配置信息，这里使用json结构，方便扩展
  config?: string;
  // 是否默认显示
  defaultShow: boolean;
}
