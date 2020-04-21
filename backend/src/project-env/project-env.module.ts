import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { ProjectEnv } from './project-env.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnv])],
})
export class ProjectEnvModule {}