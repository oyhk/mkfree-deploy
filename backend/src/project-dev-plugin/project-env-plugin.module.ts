import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEnvPlugin } from './project-env-plugin.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      ProjectEnvPlugin,
    ],
  )],
  controllers: [],
})
export class ProjectEnvPluginModule {

}
