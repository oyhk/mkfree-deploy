import { HttpService, Injectable } from '@nestjs/common';
import { PluginEurekaConfig } from './plugin-eureka-config';
import {
  PluginEurekaApplication,
  PluginEurekaApplicationInstance,
  PluginEurekaApplicationInstanceStatus,
} from './plugin-eureka.dto';
import { sleep } from '../../common/utils';

@Injectable()
export class PluginEurekaService {

  constructor(private httpService: HttpService) {
  }

  async apps(pluginEurekaApplicationInstance: PluginEurekaApplicationInstance, pluginEurekaConfig: PluginEurekaConfig) {
    const url = `${pluginEurekaConfig.eurekaUrl}/eureka/apps`;
    return this.httpService.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Basic ${Base64.encode('username' + ':' + 'password')}`,
        Authorization: `${pluginEurekaConfig.eurekaAuthType} ${Buffer.from(pluginEurekaConfig.eurekaUsername + ':' + pluginEurekaConfig.eurekaPassword).toString('base64')}`,
      },
    }).toPromise().then(value => value.data);
  }

  async app(pluginEurekaApplicationInstance: PluginEurekaApplicationInstance, pluginEurekaConfig: PluginEurekaConfig): Promise<PluginEurekaApplication> {
    const url = `${pluginEurekaConfig.eurekaUrl}/eureka/apps/${pluginEurekaApplicationInstance.app}`;
    return this.httpService.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Basic ${Base64.encode('username' + ':' + 'password')}`,
        Authorization: `${pluginEurekaConfig.eurekaAuthType} ${Buffer.from(pluginEurekaConfig.eurekaUsername + ':' + pluginEurekaConfig.eurekaPassword).toString('base64')}`,
      },
    }).toPromise().then(value => value.data);
  }

  async changeStatus(pluginEurekaApplicationInstance: PluginEurekaApplicationInstance, pluginEurekaConfig: PluginEurekaConfig) {
    const url = `${pluginEurekaConfig.eurekaUrl}/eureka/apps/${pluginEurekaApplicationInstance.app}/${pluginEurekaApplicationInstance.instanceId}/status?value=${pluginEurekaApplicationInstance.status}`;
    console.log('url', url);
    return this.httpService.put(url, {}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Basic ${Base64.encode('username' + ':' + 'password')}`,
        Authorization: `${pluginEurekaConfig.eurekaAuthType} ${Buffer.from(pluginEurekaConfig.eurekaUsername + ':' + pluginEurekaConfig.eurekaPassword).toString('base64')}`,
      },
    }).toPromise().then(value => value.data);
  }

}