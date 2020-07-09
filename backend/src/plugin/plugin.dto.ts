import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ApiResultCode } from '../common/api-result';
import { PluginEnvSetting } from './plugin-env-setting.entity';
import { PluginEnvSettingDto } from './plugin-env-setting.dto';
import { Plugin } from './plugin.entity';

/**
 * 插件 dto
 */
export class PluginDto extends Plugin {

  pluginEnvSettingList: PluginEnvSettingDto[];
}