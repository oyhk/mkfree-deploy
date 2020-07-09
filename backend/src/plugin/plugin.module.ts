import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin } from './plugin.entity';
import { PluginEnvSetting } from './plugin-env-setting.entity';
import { PluginController } from './plugin.controller';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      Plugin,
      PluginEnvSetting
    ],
  )],
  controllers: [PluginController],
})
export class PluginModule {

}
