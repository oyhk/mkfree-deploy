import { HttpModule, Module } from '@nestjs/common';
import { PluginEurekaController } from './plugin-eureka.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin } from '../../plugin/plugin.entity';
import { PluginEnvSetting } from '../../plugin/plugin-env-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        PluginEnvSetting,
      ],
    ),
    HttpModule
  ],
  controllers: [PluginEurekaController],
})
export class PluginEurekaModule {

}