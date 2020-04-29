import { BaseDto } from '@/services/dto/BaseDto';

/**
 * 项目扩展表，用于插件管理
 */
export interface ProjectEnvPlugin extends BaseDto {


  projectId: number;
  envId: number;
  // 插件名称，唯一标识
  pluginName: string;

  // eureka start
  // eureka 网关
  eurekaUrl: string;
  // eureka 认证方式
  eurekaAuthType: string;
  // eureka 用户名
  eurekaUsername: string;
  // eureka 密码
  eurekaPassword: string;
  // eureka end

}

