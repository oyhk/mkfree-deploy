interface PluginEurekaApplicationInstanceMetadata {
  systemVersion: string;
}

export interface PluginEurekaApplicationInstance {
  actionType: string;
  app: string;
  countryId: number;
  healthCheckUrl: string;
  homePageUrl: string;
  hostName: string;
  instanceId: string;
  ipAddr: string;
  isCoordinatingDiscoveryServer: string;
  lastDirtyTimestamp: string;
  lastUpdatedTimestamp: string;
  metadata: PluginEurekaApplicationInstanceMetadata;
  status: string;
  'management.port': string;
  operation: PluginEurekaApplicationInstance;
}

export interface PluginEurekaApplication {
  application: {
    name: string
    instance: PluginEurekaApplicationInstance[]
  }
}


export const PluginEurekaApplicationInstanceStatus = {
  UP: 'UP', // 项目上线
  OUT_OF_SERVICE: 'OUT_OF_SERVICE', // 项目下线
};
