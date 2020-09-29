import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { Project, ProjectLogFileType, ProjectState } from './project.entity';
import { Page } from '../common/page';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { Response } from 'express';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { Server } from '../server/server.entity';
import { ProjectCommandStep, ProjectCommandStepType } from '../project-build-step/project-command-step.entity';
import { Env } from '../env/env.entity';
import { throws } from 'assert';
import { ProjectEnvDto } from '../project-env/project-env.dto';
import * as lodash from 'lodash';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';
import { exec } from 'child_process';
import * as fs from 'fs';
import { SystemConfig, SystemConfigKeys, SystemConfigValues } from '../system-config/system-config.entity';
import { ProjectLog, ProjectLogType } from '../project-log/project-log.entity';
import { ProjectEnvLog, ProjectEnvLogType } from '../project-env-log/project-env-log.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { ProjectPlugin } from '../project-plugin/project-plugin.entity';
import { Plugin, PluginEureka, PluginList, PluginType } from '../plugin/plugin.entity';
import { UserAuth, UserAuthOperation } from '../user/user-auth';
import { JwtService } from '@nestjs/jwt';
import { ProjectEnvPlugin } from '../project-env-plugin/project-env-plugin.entity';
import { ApiException } from '../common/api.exception';
import { ProjectService } from './project.service';
import { PlanDto } from '../plan/plan.dto';
import { PluginEurekaConfig } from '../plugin-api/eureka/plugin-eureka-config';
import { PluginEurekaApplicationInstanceStatus } from '../plugin-api/eureka/plugin-eureka.dto';
import { PluginEnvSetting } from '../plugin/plugin-env-setting.entity';

@Controller()
export class ProjectController {

  constructor(
    @InjectRepository(Plugin)
    private pluginRepository: Repository<Plugin>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectPlugin)
    private projectPluginRepository: Repository<ProjectPlugin>,
    @InjectRepository(ProjectDeployFile)
    private projectDeployFileRepository: Repository<ProjectDeployFile>,
    @InjectRepository(ProjectEnv)
    private projectEnvRepository: Repository<ProjectEnv>,
    @InjectRepository(ProjectEnvPlugin)
    private projectEnvPluginRepository: Repository<ProjectEnvPlugin>,
    @InjectRepository(ProjectEnvServer)
    private projectEnvServerRepository: Repository<ProjectEnvServer>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ProjectCommandStep)
    private projectCommandStepRepository: Repository<ProjectCommandStep>,
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
    @InjectRepository(ProjectLog)
    private projectLogRepository: Repository<ProjectLog>,
    @InjectRepository(ProjectEnvLog)
    private projectEnvLogRepository: Repository<ProjectEnvLog>,
    @InjectRepository(PluginEnvSetting)
    private pluginEnvSettingRepository: Repository<PluginEnvSetting>,
    private jwtService: JwtService,
    private projectService: ProjectService,
  ) {
  }

  @Get('/api/projects/page')
  async page(@Query() dto: ProjectDto) {
    const r = new ApiResult();
    const p = new Page();

    const projectDtoList: ProjectDto[] = [];

    const envList = await this.envRepository.find({ isEnable: true });
    const envIdList = envList.map(value => value.id);

    await this.projectRepository.createQueryBuilder('p')
      .skip(dto.pageNo - 1)
      .take(dto.pageSize)
      .getManyAndCount().then(async value => {

        // 项目
        for (const project of value[0]) {
          // 项目转换为DTO
          const projectDto = { ...project } as ProjectDto;

          // 项目环境
          const projectEnvDtoList: ProjectEnvDto[] = [];
          const projectEnvList = await this.projectEnvRepository.find({ projectId: project.id });
          for (const projectEnv of projectEnvList.filter(value => envIdList.includes(value.envId)).sort((a, b) => a.envSort - b.envSort)) {
            const projectEnvDto = { ...projectEnv } as ProjectEnvDto;
            // 项目环境服务器
            projectEnvDto.projectEnvServerList = await this.projectEnvServerRepository.find({
              projectId: project.id,
              envId: projectEnv.envId,
            }) as ProjectEnvServerDto[];
            projectEnvDtoList.push(projectEnvDto);
          }
          projectDto.projectEnvList = projectEnvDtoList;

          projectDtoList.push(projectDto);
        }


        p.total = value[1];
      });
    p.data = projectDtoList;
    p.pageNo = dto.pageNo;
    p.pageSize = dto.pageSize;

    r.result = p;
    return r;
  }

  @Get('/api/projects/info')
  async info(@Query() dto: ProjectDto) {
    const ar = new ApiResult<ProjectDto>();
    const project = await this.projectRepository.findOne({ id: dto.id });
    // 项目转换为DTO
    const projectDto = { ...project } as ProjectDto;

    // 项目插件
    projectDto.projectPluginList = await this.projectPluginRepository.find({
      projectId: project.id,
      pluginIsEnable: true,
    });


    // 项目部署文件
    projectDto.projectDeployFileList = await this.projectDeployFileRepository.find({ projectId: dto.id });

    const serverList = await this.serverRepository.find();

    console.log('serverList', serverList);

    // 项目环境
    const projectEnvDtoList: ProjectEnvDto[] = [];
    const projectEnvList = await this.projectEnvRepository.find({ projectId: project.id });
    for (const projectEnv of projectEnvList.sort((a, b) => a.envSort - b.envSort)) {
      const projectEnvDto = { ...projectEnv } as ProjectEnvDto;

      // 项目环境服务器
      projectEnvDto.projectEnvServerList = [];
      for (const server of serverList) {
        const dbProjectEnvServer = await this.projectEnvServerRepository.findOne({
          projectId: project.id,
          envId: projectEnv.envId,
          serverId: server.id,
        });
        const projectEnvServer = new ProjectEnvServerDto();
        projectEnvServer.serverId = server.id;
        projectEnvServer.serverIp = server.ip;
        projectEnvServer.serverName = server.name;
        projectEnvServer.isSelectServerIp = false;
        projectEnvServer.isPublish = false;
        if (dbProjectEnvServer) {
          projectEnvServer.isSelectServerIp = true;
          projectEnvServer.isPublish = dbProjectEnvServer.isPublish;
        }
        projectEnvDto.projectEnvServerList.push(projectEnvServer);
      }

      // 项目构建命令
      projectEnvDto.projectCommandStepBuildList = await this.projectCommandStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: ProjectCommandStepType.build,
      });
      // 项目构建后命令
      projectEnvDto.projectCommandStepBuildAfterList = await this.projectCommandStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: ProjectCommandStepType.buildAfter,
      });
      // 项目同步后命令
      projectEnvDto.projectCommandStepSyncAfterList = await this.projectCommandStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: ProjectCommandStepType.sync,
      });

      // 项目环境插件
      const projectEnvPluginList = [];
      for (const projectPlugin of projectDto.projectPluginList) {
        let projectEnvPlugin = await this.projectEnvPluginRepository.findOne({
          projectId: project.id,
          envId: projectEnv.envId,
          pluginName: projectPlugin.pluginName,
        });
        if (!projectEnvPlugin) {
          projectEnvPlugin = new ProjectEnvPlugin();
          projectEnvPlugin.projectId = project.id;
          projectEnvPlugin.envId = projectEnv.envId;
          projectEnvPlugin.pluginName = projectPlugin.pluginName;
        }
        projectEnvPluginList.push(projectEnvPlugin);
      }
      projectEnvDto.projectEnvPluginList = projectEnvPluginList;

      projectEnvDtoList.push(projectEnvDto);
    }
    projectDto.projectEnvList = projectEnvDtoList;


    ar.result = projectDto;
    return ar;
  }

  @Post('/api/projects/save')
  @Transaction()
  async save(@Body() dto: ProjectDto, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {

    const ar = new ApiResult();
    let project = new Project();
    project.name = dto.name.trim();
    project.gitUrl = dto.gitUrl;
    project.remotePath = dto.remotePath;
    project.moduleName = dto.moduleName;

    // 项目
    project = await entityManager.save(Project, project);

    // 项目插件，目前默认开启
    for (const plugin of PluginList) {
      const projectPlugin = new ProjectPlugin();
      projectPlugin.pluginIsEnable = true;
      projectPlugin.projectId = project.id;
      projectPlugin.pluginName = plugin.name;
      await entityManager.save(ProjectPlugin, projectPlugin);
    }

    // 项目部署文件
    if (dto.projectDeployFileList) {
      for (const projectDeployFileDto of dto.projectDeployFileList) {
        const projectDeployFile = new ProjectDeployFile();
        projectDeployFile.projectId = project.id;
        projectDeployFile.projectName = project.name;

        projectDeployFile.isEnable = projectDeployFileDto.isEnable;
        projectDeployFile.localFilePath = projectDeployFileDto.localFilePath;
        await entityManager.save(ProjectDeployFile, projectDeployFile);
      }
    }

    // 项目环境
    if (dto.projectEnvList) {
      for (const projectEnvDto of dto.projectEnvList) {
        const env = await this.envRepository.findOne({ id: projectEnvDto.envId });
        if (!env) {
          throw new ApiException(ApiResultCode['3'](`id : ${projectEnvDto.envId} 环境不存在，请检查`));
        }
        projectEnvDto.projectId = project.id;
        projectEnvDto.projectName = project.name;
        await this.insertProjectEnvChildrenRelationData(entityManager, projectEnvDto);
      }
    }
    return res.json(ar);
  }

  @Put('/api/projects/update')
  @Transaction()
  async update(@Body() dto: ProjectDto, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {


    const ar = new ApiResult();
    if (!dto.id) {
      throw new ApiException(ApiResultCode['2']('project id can be not null'));
    }

    const project = await entityManager.findOne(Project, dto.id);
    await entityManager.update(Project, project.id, {
      name: dto.name,
      gitUrl: dto.gitUrl,
      remotePath: dto.remotePath,
      moduleName: dto.moduleName,
    });

    // 部署文件
    if (dto.projectDeployFileList) {
      // 删除所有的部署文件
      await entityManager.delete(ProjectDeployFile, { projectId: project.id });
      // 重新插入
      if (dto.projectDeployFileList.length > 0) {
        dto.projectDeployFileList.forEach((projectDeployFile) => {
          projectDeployFile.projectId = project.id;
          projectDeployFile.projectName = project.name;
        });
        await entityManager.save(ProjectDeployFile, dto.projectDeployFileList);
      }
    }

    // 环境配置
    if (dto.projectEnvList) {
      // 第一种情况：当参数中没有任何的环境列表，那么删除所有环境以及子关联表的数据
      if (dto.projectEnvList.length === 0) {
        await ProjectController.deleteProjectEnvChildrenRelationDataByProjectId(entityManager, project.id);
      } else {
        // 分组
        const projectEnvDtoGroupByEnvId = lodash.groupBy(dto.projectEnvList, projectEnvDto => projectEnvDto.envId);
        const projectEnvDtoIdList = dto.projectEnvList.map((projectEnvDto) => projectEnvDto.envId);
        // 数据库中所有的项目环境
        const projectEnvList = await entityManager.find(ProjectEnv, { projectId: project.id });
        for (const dbProjectEnv of projectEnvList) {
          // 第二种情况：参数中在数据库中存在的环境，即做更新操作
          if (projectEnvDtoIdList.indexOf(dbProjectEnv.envId) !== -1) {
            const projectEnvDto = projectEnvDtoGroupByEnvId[dbProjectEnv.envId][0];
            projectEnvDto.projectId = project.id;
            projectEnvDto.projectName = project.name;

            // 1. 删除所有子关联表数据
            // 删除环境服务器，过滤不需要删除的环境服务器
            const notDeleteProjectEnvServerIdList = projectEnvDto.projectEnvServerList.filter(projectEnvServer => projectEnvServer.isSelectServerIp && projectEnvServer.id).map(projectEnvServer => projectEnvServer.id);
            await entityManager.connection.createQueryBuilder().delete().from(ProjectEnvServer)
              .where(
                'id not in (:...projectEnvServerIdList) and projectId = :projectId and envId = :envId',
                {
                  projectEnvServerIdList: notDeleteProjectEnvServerIdList,
                  projectId: project.id,
                  envId: dbProjectEnv.envId,
                },
              )
              .execute();
            // 删除构建命令、构建后命令、同步后命令
            await entityManager.delete(ProjectCommandStep, { projectId: project.id, envId: dbProjectEnv.envId });
            // 删除项目环境
            await entityManager.delete(ProjectEnv, { projectId: project.id, envId: dbProjectEnv.envId });
            // 删除项目环境插件
            await entityManager.delete(ProjectEnvPlugin, { projectId: project.id, envId: dbProjectEnv.envId });

            // 2. 插入所有子关联表数据
            await this.insertProjectEnvChildrenRelationData(entityManager, projectEnvDto);
            // 3. 更新项目环境
            const syncServer = await entityManager.findOne(Server, projectEnvDto.syncServerId);
            await entityManager.update(ProjectEnv, dbProjectEnv.id,
              {
                publishBranch: projectEnvDto.publishBranch,
                isSelectBranch: projectEnvDto.isSelectBranch,
                syncServerId: syncServer.id,
                syncServerName: syncServer.name,
                syncServerIp: syncServer.ip,
              },
            );
          }
          // 第三种情况：否则做删除，删除时处理所有关联表
          else {
            await ProjectController.deleteProjectEnvChildrenRelationDataByProjectIdAndEnvId(entityManager, project.id, dbProjectEnv.envId);
          }
        }

        // 第四种情况：dto存在而数据库不存在，直接插入到数据库中
        const dbProjectEnvIdList = projectEnvList.map((projectEnv) => projectEnv.envId);
        const newProjectEnvDtoList = dto.projectEnvList.filter(projectEnvDto => dbProjectEnvIdList.indexOf(projectEnvDto.envId) === -1);
        for (const projectEnvDto of newProjectEnvDtoList) {
          const syncServer = await entityManager.findOne(Server, projectEnvDto.syncServerId);
          const env = await entityManager.findOne(Env, projectEnvDto.envId);
          projectEnvDto.projectId = project.id;
          projectEnvDto.projectName = project.name;
          projectEnvDto.envId = env.id;
          projectEnvDto.envName = env.name;
          projectEnvDto.envSort = env.sort;
          projectEnvDto.syncServerIp = syncServer.ip;
          projectEnvDto.syncServerName = syncServer.name;
          await this.insertProjectEnvChildrenRelationData(entityManager, projectEnvDto);
        }
      }
    }

    res.json(ar);
  }

  /**
   * 删除项目环境子关联表数据
   * @param entityManager
   * @param projectId
   * @param envId
   */
  private static async deleteProjectEnvChildrenRelationDataByProjectIdAndEnvId(entityManager: EntityManager, projectId: number, envId?: number) {
    // 删除环境服务器
    await entityManager.delete(ProjectEnvServer, { projectId, envId });
    // 删除构建命令、构建后命令、同步后命令
    await entityManager.delete(ProjectCommandStep, { projectId, envId });
    // 删除项目环境
    await entityManager.delete(ProjectEnv, { projectId, envId });
    // 删除项目环境插件
    await entityManager.delete(ProjectEnvPlugin, { projectId, envId });

  }

  private static async deleteProjectEnvChildrenRelationDataByProjectId(entityManager: EntityManager, projectId: number) {
    // 删除部署服务器
    await entityManager.delete(ProjectEnvServer, { projectId });
    // 删除构建命令、构建后命令、同步后命令
    await entityManager.delete(ProjectCommandStep, { projectId });
    // 删除项目环境日志
    await entityManager.delete(ProjectEnvLog, { projectId });
    // 删除项目环境
    await entityManager.delete(ProjectEnv, { projectId });

  }

  /**
   * 插入项目环境子关联表数据
   * @param entityManager
   * @param projectId
   * @param projectEnvDto
   */
  private async insertProjectEnvChildrenRelationData(entityManager: EntityManager, projectEnvDto: ProjectEnvDto) {
    // 插入构建命令
    const beforeProjectBuildStepList = projectEnvDto?.projectCommandStepBuildList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.build;
      return projectBuildStep;
    });
    if (beforeProjectBuildStepList) {
      await entityManager.save(ProjectCommandStep, beforeProjectBuildStepList);
    }
    // 插入构建后命令
    const afterProjectBuildStepList = projectEnvDto?.projectCommandStepBuildAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.buildAfter;
      return projectBuildStep;
    });
    if (afterProjectBuildStepList)
      await entityManager.save(ProjectCommandStep, afterProjectBuildStepList);
    // 插入同步命令
    const syncProjectBuildStepList = projectEnvDto?.projectCommandStepSyncAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.sync;
      return projectBuildStep;
    });
    if (syncProjectBuildStepList)
      await entityManager.save(ProjectCommandStep, syncProjectBuildStepList);
    // 插入环境服务器
    for (const projectEnvServerDto of projectEnvDto?.projectEnvServerList?.filter(projectEnvServerDto => projectEnvServerDto.isSelectServerIp)) {
      console.log(projectEnvServerDto.id);
      // 当环境服务器存在服务器做更新，否则新建
      if (projectEnvServerDto.id) {
        await entityManager.update(ProjectEnvServer, projectEnvServerDto.id, { isPublish: projectEnvServerDto.isPublish });
      } else {
        const projectEnvServer = new ProjectEnvServer();
        projectEnvServer.envId = projectEnvDto.envId;
        projectEnvServer.envName = projectEnvDto.envName;
        projectEnvServer.projectId = projectEnvDto.projectId;
        projectEnvServer.projectName = projectEnvDto.projectName;
        const server = await entityManager.findOne(Server, { ip: projectEnvServerDto.serverIp });
        projectEnvServer.serverId = server.id;
        projectEnvServer.serverIp = server.ip;
        projectEnvServer.serverName = server.name;
        projectEnvServer.isPublish = projectEnvServerDto.isPublish;
        await entityManager.save(ProjectEnvServer, projectEnvServer);
      }
    }
    // 插入环境插件
    if (projectEnvDto?.projectEnvPluginList) {
      for (const projectEnvPlugin of projectEnvDto?.projectEnvPluginList) {
        projectEnvPlugin.projectId = projectEnvDto.projectId;
        projectEnvPlugin.envId = projectEnvDto.envId;
        await entityManager.save(ProjectEnvPlugin, projectEnvPlugin);
      }
    }
    // 插入项目环境
    await entityManager.save(ProjectEnv, projectEnvDto);
  }

  @Delete('/api/projects/delete')
  @Transaction()
  async delete(@Body() dto: ProjectDto, @Req() req, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    // 非管理员 无权限删除
    if (userAuth.roleType !== 0) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    const project = await entityManager.findOne(Project, dto.id);
    console.log('project', project);
    if (!project) {
      ar.remindRecordNotExist(Project.entityName, dto.id);
      return res.json(ar);
    }
    const projectId = project.id;
    // 项目环境插件
    await entityManager.delete(ProjectEnvPlugin, { projectId });
    // 项目环境服务器
    await entityManager.delete(ProjectEnvServer, { projectId });
    // 项目环境日志
    await entityManager.delete(ProjectEnvLog, { projectId });
    // 项目环境
    await entityManager.delete(ProjectEnv, { projectId });
    // 项目部署文件
    await entityManager.delete(ProjectDeployFile, { projectId });
    // 项目命令步骤
    await entityManager.delete(ProjectCommandStep, { projectId });
    // 项目日志
    await entityManager.delete(ProjectLog, { projectId });
    // 项目插件
    await entityManager.delete(ProjectPlugin, { projectId });
    // 项目
    await entityManager.delete(Project, { id: projectId });

    // 删除磁盘项目相关文件
    const installPathSystemConfig = await entityManager.findOne(SystemConfig, { key: SystemConfigKeys.installPath });
    exec(`
    echo "rm -rf ${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}"
    rm -rf ${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}
    echo "rm -rf ${installPathSystemConfig.value}${SystemConfigValues.logPath}/${project.name}"
    rm -rf ${installPathSystemConfig.value}${SystemConfigValues.logPath}/${project.name}
    echo "rm -rf ${installPathSystemConfig.value}${SystemConfigValues.buildPath}/${project.name}"
    rm -rf ${installPathSystemConfig.value}${SystemConfigValues.buildPath}/${project.name}
    `, {}, (error, stdOut, stdError) => {
      console.log(stdOut);
      console.log(stdError);
      console.log(`删除项目: ${project.name} 完成。`);
    });
    return res.json(ar);
  }

  /**
   * 项目初始化，从Git仓库中 clone到本地
   * @param dto
   * @param res
   */
  @Post('/api/projects/init')
  async init(@Body() dto: ProjectDto, @Res() res: Response) {
    const ar = new ApiResult();
    try {
      const project = await this.projectRepository.findOne(dto.id);
      const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });

      let projectInitLogSeq = project.initLogSeq + 1;

      // 有可能点击构建太快的原因，导致LogSeq冲突，这里优化
      const projectLogList = await this.projectLogRepository.find({
        projectId: project.id,
        type: ProjectLogType.init,
        projectInitLogSeq: projectInitLogSeq,
      });
      if (projectLogList.length > 0) {
        projectInitLogSeq = projectInitLogSeq + 1;
      }
      await this.projectLogRepository.save({
        projectId: project.id,
        projectInitLogSeq: projectInitLogSeq,
        type: ProjectLogType.init,
      });


      const jobPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}`;
      const projectPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}`;

      let shell = `
        echo "Start of git init project:${project.name}.";
        # 1. 创建job路径
        echo "mkdir -p ${jobPath}";
        mkdir -p ${jobPath};
        # 2. 删除项目路径
        echo "rm -rf ${projectPath}";
        rm -rf ${projectPath};
        # 3. cd jobPath
        echo "cd ${jobPath}";
        cd ${jobPath};
        # 4. 创建项目路径
        echo "mkdir -p ${projectPath}";
        mkdir -p ${projectPath};
        # 7. cd projectPath
        echo "cd ${projectPath}";
        cd ${projectPath}
        # 8. git clone 项目
        echo "git clone ${project.gitUrl} default";
        git clone ${project.gitUrl} default
        # 9. 从 default 复制多个不同环境的项目
      `;

      const projectEnvList = await this.projectEnvRepository.find({ projectId: project.id });
      for (const projectEnv of projectEnvList) {
        const env = await this.envRepository.findOne(projectEnv.envId);
        shell += `
          echo "cp -r default ${env.code}";
          cp -r default ${env.code}
        `;
      }
      shell += `
        # 10. 结束项目初始化
        echo "End of git init project:${project.name}.";
      `;
      const projectLogPath = `${installPathSystemConfig.value}/logs/${project.name}`;
      fs.mkdirSync(projectLogPath, { recursive: true });
      const writeStream = fs.createWriteStream(`${projectLogPath}/${ProjectLogFileType.init(projectInitLogSeq)}`);
      const child = exec(shell);
      child.stderr.on('data', (data) => {
        console.log('stderr', data);
        writeStream.write(data);
      });
      child.stdout.on('data', (data) => {
        console.log('stdout', data);
        writeStream.write(data);
      });

      child.stdout.on('end', () => {
        this.projectRepository.update({ id: project.id }, {
          state: ProjectState.success,
          initLogSeq: projectInitLogSeq,
        });
      });
      child.stderr.on('end', () => {
        this.projectRepository.update({ id: project.id }, {
          state: ProjectState.success,
          initLogSeq: projectInitLogSeq,
        });
      });
    } catch (e) {
      console.log(e);
    }
    return res.json(ar);
  }

  /**
   * 项目构建
   * @param dto
   * @param res
   */
  @Post('/api/projects/build')
  async build(@Body() dto: ProjectDto, @Res() res: Response) {
    const ar = new ApiResult();
    await this.projectService.build({
      projectId: dto.id,
      publicBranch: dto.projectEnvServerPublishBranch,
      serverId: dto.projectEnvServerId,
      envId: dto.envId,
    });
    return res.json(ar);
  }

  /**
   * 项目同步
   * @param dto
   * @param res
   */
  @Post('/api/projects/sync')
  async sync(@Body() dto: ProjectDto, @Res() res: Response) {
    const ar = new ApiResult();
    await this.projectService.sync({
      projectId: dto.id,
      publishBranch: dto.projectEnvServerPublishBranch,
      syncServerId: dto.syncServerId,
      targetServerId: dto.projectEnvServerId,
      envId: dto.envId,
    });
    return res.json(ar);
  }

  /**
   * 项目刷新分支
   * @param dto
   * @param res
   */
  @Post('/api/projects/refreshBranch')
  async refreshBranch(@Body() dto: ProjectDto, @Res() res: Response) {
    const ar = new ApiResult();
    const project = await this.projectRepository.findOne(dto.id);
    if (!project) {
      ar.remindRecordNotExist(Project.entityName, dto.id);
      return res.json(ar);
    }
    if (project.state != 2) {
      ar.remind(ApiResultCode['1001']);
      return res.json(ar);
    }
    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });

    const projectGitDefaultPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}/default`;

    const projectGitDefaultPathExist = fs.existsSync(projectGitDefaultPath);
    if (!projectGitDefaultPathExist) {
      ar.remind(ApiResultCode['1002']);
      return res.json(ar);
    }

    const shell = `
      cd ${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}/default
      git pull
      git branch -a
    `;

    exec(shell, {}, async (exception, stdout, stderr) => {
      // console.log('stdout',stdout);
      let branchList = stdout.split('\n');
      branchList = branchList.filter(branch => {
        return branch.indexOf('Already up to date.') === -1
          && branch.indexOf('remotes/origin') !== -1
          && branch.indexOf('remotes/origin/HEAD') === -1;
      }).map(branch => branch.trim()).map(branch => branch.replace('remotes/origin/', '')).reverse();
      console.log('branchList', branchList);

      await this.projectRepository.update(project.id, { branchList: JSON.stringify(branchList) });
    });


    return res.json(ar);
  }


  /**
   * 动态部署
   * @param dto
   * @param res
   */
  @Post('/api/projects/dynamic-publish')
  async dynamicPublish(@Body() dto: ProjectDto, @Res() res: Response) {
    const ar = new ApiResult();
    this.asyncDynamicPublish(dto);
    return res.json(ar);
  }

  /**
   * 动态部署异步发布
   * @param dto
   */
  async asyncDynamicPublish(dto: ProjectDto) {
    const project = await this.projectRepository.findOne(dto.id);

    const projectEnv = await this.projectEnvRepository.findOne({ projectId: dto.id, envId: dto.envId });

    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: PluginEureka.name,
      envId: dto.envId,
    });
    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);

    console.log('项目灰度发布开始');


    const serverList = dto.projectEnvServerList;


    const publishServerIpList = [projectEnv.syncServerIp];
    // 1.1 Eureka下线发布服务器
    await this.projectService.projectAppChangeStatusInEureka({
      projectName: project.name,
      serverIpList: publishServerIpList,
      pluginEurekaApplicationInstanceStatus: PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE,
    }, pluginEurekaConfig);
    // 1.2 发布发布服务器项目
    await this.projectService.projectBuild({
      projectId: project.id,
      projectName: project.name,
      envId: dto.envId,
      serverId: projectEnv.syncServerId,
      serverName: projectEnv.syncServerName,
      publishBranch: projectEnv.publishBranch,
    });

    // 1.3 上线发布项目到Eureka注册中心
    await this.projectService.projectAppChangeStatusInEureka({
      projectName: project.name,
      serverIpList: publishServerIpList,
      pluginEurekaApplicationInstanceStatus: PluginEurekaApplicationInstanceStatus.UP,
    }, pluginEurekaConfig);

    // 需要同步的服务器一台台执行
    const syncServerList = serverList.filter(value => !value.isPublish && value.isSelectServerIp);
    for (const syncServer of syncServerList) {
      // 1.4 Eureka 下线同步服务器项目
      await this.projectService.projectAppChangeStatusInEureka({
        projectName: project.name,
        serverIpList: [syncServer.serverIp],
        pluginEurekaApplicationInstanceStatus: PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE,
      }, pluginEurekaConfig);

      // 1.5 从发布服务器同步到同步服务器中
      await this.projectService.projectSync({
        projectId: project.id,
        envId: dto.envId,
        syncServerId: projectEnv.syncServerId,
        syncServerName: projectEnv.syncServerName,
        targetServerId: syncServer.serverId,
        targetServerName: syncServer.serverName,
        publishBranch: projectEnv.publishBranch,
      });

      // 1.6 同步完成后，在Eureka中上线
      await this.projectService.projectAppChangeStatusInEureka({
        projectName: project.name,
        serverIpList: [syncServer.serverIp],
        pluginEurekaApplicationInstanceStatus: PluginEurekaApplicationInstanceStatus.UP,
      }, pluginEurekaConfig);
    }



    console.log('项目动态发布完成');
  }

}
