import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectCommandStep } from './project-command-step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCommandStep])],
})
export class ProjectCommandStepModule {}
