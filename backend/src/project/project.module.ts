import { HttpModule, Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { Env } from '../env/env.entity';
import { SystemConfig } from '../system-config/system-config.entity';
import { ProjectLog } from '../project-log/project-log.entity';
import { ProjectEnvLog } from '../project-env-log/project-env-log.entity';
import { ProjectPlugin } from '../project-plugin/project-plugin.entity';
import { Plugin } from '../plugin/plugin.entity';
import { JwtModule } from '@nestjs/jwt';
import { ProjectEnvPlugin } from '../project-env-plugin/project-env-plugin.entity';
import { ProjectService } from './project.service';
import { PluginEnvSetting } from '../plugin/plugin-env-setting.entity';
import { PluginEurekaService } from '../plugin-api/eureka/plugin-eureka.service';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      Project,
      Plugin,
      ProjectPlugin,
      ProjectDeployFile,
      ProjectEnv,
      ProjectEnvPlugin,
      ProjectEnvServer,
      Server,
      ProjectCommandStep,
      Env,
      SystemConfig,
      ProjectLog,
      ProjectEnvLog,
      PluginEnvSetting,
    ],
  ),
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    HttpModule],
  providers: [ProjectService, PluginEurekaService],
  controllers: [ProjectController],
})
export class ProjectModule {

}
