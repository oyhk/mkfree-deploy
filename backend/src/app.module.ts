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
import { ProjectLogTextModule } from './project-log/project-log-text.module';
import { LogModule } from './log-websocket/log.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mkfree-deploy.db',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    ProjectModule,
    ServerModule,
    EnvModule,
    ProjectEnvModule,
    ProjectLogModule,
    ProjectLogTextModule,
    ProjectEnvServerModule,
    ProjectDeployFileModule,
    ProjectCommandStepModule,
    SystemConfigModule,
    LogModule
  ],
  controllers: [AppController],
})
export class AppModule {

}
