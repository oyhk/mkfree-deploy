import { BaseDto } from '@/models/dto/BaseDto';

export interface ProjectPluginDto extends BaseDto {
  // 项目id
  projectId: number;
  // 插件id
  pluginId: number;
  // 插件名称
  pluginName: string;
  // 是否开启,默认否
  pluginIsEnable: boolean;
  // 插件Code，唯一标识
  pluginCode: string;
}
