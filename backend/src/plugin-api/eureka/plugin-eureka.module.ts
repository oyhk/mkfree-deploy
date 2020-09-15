import { HttpModule, Module } from '@nestjs/common';
import { PluginEurekaController } from './plugin-eureka.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plugin } from '../../plugin/plugin.entity';
import { PluginEnvSetting } from '../../plugin/plugin-env-setting.entity';
import { PluginEurekaService } from './plugin-eureka.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        PluginEnvSetting,
      ],
    ),
    HttpModule
  ],
  providers:[PluginEurekaService],
  controllers: [PluginEurekaController],
})
export class PluginEurekaModule {

}