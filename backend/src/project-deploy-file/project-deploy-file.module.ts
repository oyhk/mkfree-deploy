import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDeployFile } from './project-deploy-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectDeployFile])],
})
export class ProjectDeployFileModule {

}
