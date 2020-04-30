import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { ProjectEnv } from './project-env.entity';
import { ProjectEnvController } from './project-env.controller';
import { ProjectEnvLog } from '../project-env-log/project-env-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnv,ProjectEnvLog])],
  controllers:[ProjectEnvController]
})
export class ProjectEnvModule {}
