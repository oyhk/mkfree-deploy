import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectLogText } from './project-log-text.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectLogText])]
})
export class ProjectLogTextModule {}