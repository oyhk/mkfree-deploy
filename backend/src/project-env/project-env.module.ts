import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { ProjectEnv } from './project-env.entity';
import { ProjectEnvController } from './project-env.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnv])],
  controllers:[ProjectEnvController]
})
export class ProjectEnvModule {}
