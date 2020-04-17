import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectLog } from './project-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectLog])]
})
export class ProjectLogModule {}