import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ServerModule } from './server/server.module';
import { EnvModule } from './env/env.module';
import { ProjectEnvModule } from './project-env/project-env.module';
import { ProjectEnvServerModule } from './project-env-server/project-env-server.module';
import { ProjectDeployFileModule } from './project-deploy-file/project-deploy-file.module';
import { ProjectCommandStepModule } from './project-build-step/project-command-step.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { ProjectLogModule } from './project-log/project-log.module';
import { ProjectEnvLogModule } from './project-env-log/project-env-log.module';
import { ProjectPluginModule } from './project-plugin/project-plugin.module';
import { PluginModule } from './plugin/plugin.module';
import { SystemModule } from './system-config/system.module';
import { PlanModule } from './plan/plan.module';
import { ProjectEnvPluginModule } from './project-env-plugin/project-env-plugin.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mkfree-deploy.db',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    SystemModule,
    UserModule,
    PluginModule,
    ProjectModule,
    ProjectPluginModule,
    ServerModule,
    EnvModule,
    ProjectEnvModule,
    ProjectEnvPluginModule,
    ProjectEnvLogModule,
    ProjectLogModule,
    ProjectEnvServerModule,
    ProjectDeployFileModule,
    ProjectCommandStepModule,
    SystemConfigModule,
    PlanModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {

}
