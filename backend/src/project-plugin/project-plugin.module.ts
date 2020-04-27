import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPlugin } from './project-plugin.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      ProjectPlugin,
    ],
  )],
  controllers: [],
})
export class ProjectPluginModule {

}
