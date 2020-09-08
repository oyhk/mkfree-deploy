import { Body, Controller, Get, HttpService, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../../common/api-result';
import { PluginEurekaDto } from './plugin-eureka.dto';
import { PluginEnvSetting } from '../../plugin/plugin-env-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PluginEurekaConfig } from './plugin-eureka-config';

@Controller()
export class PluginEurekaController {

  constructor(private httpService: HttpService,
              @InjectRepository(PluginEnvSetting)
              private pluginEnvSettingRepository: Repository<PluginEnvSetting>) {
  }

  @Get('/api/plugin/eureka/list')
  async list(@Query() dto: PluginEurekaDto, @Res() res: Response) {

    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: 'Eureka',
      envId: dto.envId,
    });
    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);
    const ar = new ApiResult();
    const url = `${pluginEurekaConfig.eurekaUrl}/eureka/apps`;

    ar.result = await this.httpService.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Basic ${Base64.encode('username' + ':' + 'password')}`,
        Authorization: `${pluginEurekaConfig.eurekaAuthType} ${Buffer.from(pluginEurekaConfig.eurekaUsername + ':' +pluginEurekaConfig.eurekaPassword).toString('base64')}`,
      },
    }).toPromise().then(value => value.data);
    return res.json(ar);
  }

  @Put('/api/plugin/eureka/status')
  async status(@Body() dto: PluginEurekaDto, @Res() res: Response) {
    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: 'Eureka',
      envId: dto.envId,
    });
    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);

    const ar = new ApiResult();
    const url = `${pluginEurekaConfig.eurekaUrl}/eureka/apps/${dto.app}/${dto.instanceId}/status?value=${dto.status}`;
    ar.result = await this.httpService.put(url, {}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Basic ${Base64.encode('username' + ':' + 'password')}`,
        Authorization: `${pluginEurekaConfig.eurekaAuthType} ${Buffer.from(pluginEurekaConfig.eurekaUsername + ':' +pluginEurekaConfig.eurekaPassword).toString('base64')}`,
      },
    }).toPromise().then(value => value.data);
    return res.json(ar);
  }

}