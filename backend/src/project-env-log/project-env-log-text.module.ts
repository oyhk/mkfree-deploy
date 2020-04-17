import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEnvLogText } from './project-env-log-text.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnvLogText])]
})
export class ProjectEnvLogTextModule {}