import { Module } from '@nestjs/common';
import { ProjectEnvServerController } from './project-env-server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { ProjectEnvServer } from './project-env-server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEnvServer])],
  controllers: [ProjectEnvServerController]
})
export class ProjectEnvServerModule {}
