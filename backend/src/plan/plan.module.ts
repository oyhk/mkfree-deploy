import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../server/server.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlanController } from './plan.controller';
import { Env } from '../env/env.entity';
import { Project } from '../project/project.entity';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { Plan } from './plan.entity';
import { PlanEnv } from './plan-env.entity';
import { Plugin } from '../plugin/plugin.entity';
import { PlanEnvProjectConfigServer } from './plan-env-project-config-server.entity';
import { PlanScript } from './plan-script.entity';
import { PlanProjectSort } from './plan-project-sort.entity';
import { PluginEurekaService } from '../plugin-api/eureka/plugin-eureka.service';
import { PluginEnvSetting } from '../plugin/plugin-env-setting.entity';
import { ProjectService } from '../project/project.service';
import { ProjectEnvLog } from '../project-env-log/project-env-log.entity';
import { ProjectPlugin } from '../project-plugin/project-plugin.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvPlugin } from '../project-env-plugin/project-env-plugin.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { SystemConfig } from '../system-config/system-config.entity';
import { ProjectLog } from '../project-log/project-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Env, Server, Project,
      Plan, PlanProjectSort, ProjectEnvLog,
      PlanEnv, PlanEnvProjectConfig, PlanEnvProjectConfigServer,
      PlanScript, PluginEnvSetting, Plugin,
      ProjectPlugin, ProjectDeployFile, ProjectEnv, ProjectEnvPlugin,
      ProjectEnvServer, ProjectCommandStep, SystemConfig,
      ProjectLog,
    ]),
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    HttpModule,
  ],
  providers: [PluginEurekaService, ProjectService],
  controllers: [PlanController],
})
export class PlanModule {
}
