export interface PluginEurekaApplicationInstanceMetadata {
  systemVersion: string;
}

export interface PluginEurekaApplicationInstance {
  actionType?: string;
  // 应用 名称
  app?: string;
  countryId?: number;
  healthCheckUrl?: string;
  homePageUrl?: string;
  hostName?: string;
  // 应用 注册后实例ID
  instanceId?: string;
  ipAddr?: string;
  isCoordinatingDiscoveryServer?: string;
  lastDirtyTimestamp?: string;
  lastUpdatedTimestamp?: string;
  metadata?: PluginEurekaApplicationInstanceMetadata;
  // 应用 状态
  status?: string;
  'management.port'?: string;
  operation?: PluginEurekaApplicationInstance;
  envId?: number;
}

export interface PluginEurekaApplication {
  application: {
    name: string
    instance: PluginEurekaApplicationInstance[]
  }
}

/**
 * 插件Eureka
 */
export const PluginEurekaApplicationInstanceStatus = {
  UP: 'UP', // 项目上线
  OUT_OF_SERVICE: 'OUT_OF_SERVICE', // 项目下线
};
