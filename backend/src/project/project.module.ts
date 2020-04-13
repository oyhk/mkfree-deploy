import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { ProjectBuildStep } from '../project-build-step/project-build-step.entity';
import { Env } from '../env/env.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project,ProjectDeployFile,ProjectEnv,ProjectEnvServer,Server,ProjectBuildStep,Env])],
  controllers: [ProjectController],
})
export class ProjectModule {

}
