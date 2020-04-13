import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { ServerModule } from './server/server.module';
import { EnvModule } from './env/env.module';
import { ProjectEnvModule } from './project-env/project-env.module';
import { ProjectEnvServerModule } from './project-env-server/project-env-server.module';
import { ProjectDeployFileModule } from './project-deploy-file/project-deploy-file.module';
import { ProjectBuildStepModule } from './project-build-step/project-build-step.module';


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
    ProjectEnvServerModule,
    ProjectDeployFileModule,
    ProjectBuildStepModule,
  ],
  controllers: [AppController],
})
export class AppModule {

}
