import { BaseDto } from '@/services/dto/BaseDto';
import { ProjectBuildStepDto } from '@/services/dto/ProjectBuildStepDto';
import { ProjectEnvServerDto } from '@/services/dto/ProjectEnvServerDto';
import { ProjectEnvLogDto } from '@/services/dto/ProjectEnvLogDto';
import { ProjectEnvPluginDto } from '@/services/dto/ProjectEnvPluginDto';

/**
 * 项目环境
 */
export interface ProjectEnvDto extends BaseDto {
  // 项目id
  projectId: number;
  projectName:string;
  // 环境id
  envId: number;
  envName: string;
  // 插件名称，唯一标识
  pluginName: string;

  projectEnvServerList: ProjectEnvServerDto[];

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
