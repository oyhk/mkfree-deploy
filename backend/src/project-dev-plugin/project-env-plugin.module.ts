import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEnvPlugin } from './project-env-plugin.entity';
import { ProjectEnvPluginController } from './project-env-plugin.controller';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      ProjectEnvPlugin,
    ],
  )],
  controllers: [ProjectEnvPluginController],
})
export class ProjectEnvPluginModule {

}
