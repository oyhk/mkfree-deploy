import { Body, Controller, Get, HttpService, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../../common/api-result';
import { PluginEurekaApplicationInstance } from './plugin-eureka.dto';
import { PluginEnvSetting } from '../../plugin/plugin-env-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PluginEurekaConfig } from './plugin-eureka-config';
import { PluginEurekaService } from './plugin-eureka.service';
import { PluginEureka } from '../../plugin/plugin.entity';

@Controller()
export class PluginEurekaController {

  constructor(private pluginEurekaService: PluginEurekaService,
              @InjectRepository(PluginEnvSetting)
              private pluginEnvSettingRepository: Repository<PluginEnvSetting>) {
  }

  @Get('/api/plugin/eureka/list')
  async list(@Query() dto: PluginEurekaApplicationInstance, @Res() res: Response) {
    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: PluginEureka.name,
      envId: dto.envId,
    });
    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);
    const ar = new ApiResult();
    ar.result = await this.pluginEurekaService.apps(dto, pluginEurekaConfig);
    return res.json(ar);
  }

  @Put('/api/plugin/eureka/status')
  async status(@Body() dto: PluginEurekaApplicationInstance, @Res() res: Response) {
    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: PluginEureka.name,
      envId: dto.envId,
    });

    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);

    const ar = new ApiResult();
    ar.result = await this.pluginEurekaService.changeStatus(dto, pluginEurekaConfig);
    return res.json(ar);
  }

}