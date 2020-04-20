import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { Env } from '../env/env.entity';
import { SystemConfig } from '../system-config/system-config.entity';
import { ProjectLog } from '../project-log/project-log.entity';
import { ProjectEnvLog } from '../project-env-log/project-env-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      Project,
      ProjectDeployFile,
      ProjectEnv,
      ProjectEnvServer,
      Server,
      ProjectCommandStep,
      Env,
      SystemConfig,
      ProjectLog,
      ProjectEnvLog,
    ],
  )],
  controllers: [ProjectController],
})
export class ProjectModule {

}
