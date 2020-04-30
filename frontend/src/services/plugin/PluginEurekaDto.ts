interface PluginEurekaApplicationInstanceMetadata {
  systemVersion: string;
}

interface PluginEurekaApplicationInstance {
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
}

export interface PluginEurekaApplication {
  application: {
    name: string
    instance: PluginEurekaApplicationInstance[]
  }
}
