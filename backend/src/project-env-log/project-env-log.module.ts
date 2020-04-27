import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEnvLog } from './project-env-log.entity';
import { ProjectEnvLogController } from './project-env-log.controller';
import { Env } from '../env/env.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { Project } from '../project/project.entity';
import { SystemConfig } from '../system-config/system-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnvLog, Project, ProjectEnv, Env, SystemConfig])],
  controllers: [ProjectEnvLogController],
})
export class ProjectEnvLogModule {
}