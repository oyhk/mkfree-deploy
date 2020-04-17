import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEnvLog } from './project-env-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnvLog])]
})
export class ProjectEnvLogModule {}