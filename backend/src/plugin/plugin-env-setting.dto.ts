import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';
import { PluginEnvSetting } from './plugin-env-setting.entity';

/**
 * 插件环境配置 dto
 */
export class PluginEnvSettingDto extends PluginEnvSetting {

  // Eureka 参数配置开始
  eurekaAuthType: string;
  eurekaUsername: string;
  eurekaPassword: string;
  eurekaUrl: string;
  // Eureka 参数配置结束
}