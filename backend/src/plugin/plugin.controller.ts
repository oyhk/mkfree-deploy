import {
  Body,
  Controller,
  Get, Post,
  Query,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResultCode, ApiResult } from '../common/api-result';
import { Response } from 'express';
import { PluginEnvSetting } from './plugin-env-setting.entity';
import { ProjectEnvPlugin } from '../project-env-plugin/project-env-plugin.entity';
import { PluginEnvSettingDto } from './plugin-env-setting.dto';
import { PluginDto } from './plugin.dto';
import { PluginList } from './plugin.entity';

@Controller()
export class PluginController {

  constructor(
    @InjectRepository(PluginEnvSetting)
    private pluginEnvSettingRepository: Repository<PluginEnvSetting>,
  ) {
  }

  @Get('/api/plugin/list')
  async list(@Query() dto: PluginEnvSetting, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = PluginList;
    return res.json(ar);
  }

  @Post('/api/pluginEnvSetting/save')
  async pluginEnvSettingSave(@Body() dto: PluginDto, @Res() res: Response) {
    const ar = new ApiResult();

    for (const pluginEnvSettingDto of dto.pluginEnvSettingList) {
      const dbPluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
        envId: pluginEnvSettingDto.envId,
        pluginName: pluginEnvSettingDto.pluginName,
      });
      if (dbPluginEnvSetting) {
        await this.pluginEnvSettingRepository.update(dbPluginEnvSetting.id, {
          defaultShow: pluginEnvSettingDto.defaultShow,
          config: JSON.stringify({
            eurekaUsername: pluginEnvSettingDto.eurekaUsername,
            eurekaPassword: pluginEnvSettingDto.eurekaPassword,
            eurekaUrl: pluginEnvSettingDto.eurekaUrl,
            eurekaAuthType: pluginEnvSettingDto.eurekaAuthType,
          }),
        });
      } else {
        pluginEnvSettingDto.config = JSON.stringify({
          eurekaUsername: pluginEnvSettingDto.eurekaUsername,
          eurekaPassword: pluginEnvSettingDto.eurekaPassword,
          eurekaUrl: pluginEnvSettingDto.eurekaUrl,
          eurekaAuthType: pluginEnvSettingDto.eurekaAuthType,
        });
        await this.pluginEnvSettingRepository.save(pluginEnvSettingDto);
      }
    }
    return res.json(ar);
  }

  @Get('/api/pluginEnvSetting/list')
  async pluginEnvSettingList(@Query() dto: PluginEnvSetting, @Res() res: Response) {
    const ar = new ApiResult();
    const pluginEnvSettingList = await this.pluginEnvSettingRepository.find({
      pluginName: dto.pluginName,
    });

    for (const pluginEnvSetting of pluginEnvSettingList as PluginEnvSettingDto[]) {
      const config = JSON.parse(pluginEnvSetting.config);
      pluginEnvSetting.eurekaUsername = config?.eurekaUsername;
      pluginEnvSetting.eurekaPassword = config?.eurekaPassword;
      pluginEnvSetting.eurekaUrl = config?.eurekaUrl;
      pluginEnvSetting.eurekaAuthType = config?.eurekaAuthType;
    }

    ar.result = pluginEnvSettingList;
    return res.json(ar);
  }

  @Get('/api/pluginEnvSetting/info')
  async info(@Query() dto: PluginEnvSetting, @Res() res: Response) {
    const ar = new ApiResult();
    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: dto.pluginName,
      envId: dto.envId,
    });
    if (!pluginEnvSetting) {
      ar.remindRecordNotExist(ProjectEnvPlugin.entityName, { pluginName: dto.pluginName, envId: dto.envId });
      return res.json(ar);
    }

    const pluginEnvSettingDto = pluginEnvSetting as PluginEnvSettingDto;

    const config = JSON.parse(pluginEnvSetting.config);
    pluginEnvSettingDto.eurekaUsername = config?.eurekaUsername;
    pluginEnvSettingDto.eurekaPassword = config?.eurekaPassword;
    pluginEnvSettingDto.eurekaUrl = config?.eurekaUrl;
    pluginEnvSettingDto.eurekaAuthType = config?.eurekaAuthType;

    ar.result = pluginEnvSettingDto;
    return res.json(ar);
  }


}