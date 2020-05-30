import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlanController } from './plan.controller';
import { Env } from '../env/env.entity';
import { Project } from '../project/project.entity';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { Plan } from './plan.entity';
import { PlanEnv } from './plan-env.entity';
import { PlanEnvProjectConfigServer } from './plan-env-project-config-server.entity';
import { PlanScript } from './plan-script.entity';
import { PlanProjectSort } from './plan-project-sort.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Env,Project,Plan,PlanProjectSort,PlanEnv,PlanEnvProjectConfig,PlanEnvProjectConfigServer,PlanScript]), JwtModule.register({ secret: 'hard!to-guess_secret' })],
  controllers: [PlanController],
})
export class PlanModule {
}
