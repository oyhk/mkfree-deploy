import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { Project, ProjectLogFileType, ProjectState } from './project.entity';
import { Page } from '../common/page';
import { ApiHttpCode, ApiResult } from '../common/api-result';
import { Response } from 'express';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { ProjectCommandStep, ProjectCommandStepType } from '../project-build-step/project-command-step.entity';
import { Env } from '../env/env.entity';
import { throws } from 'assert';
import { ProjectEnvDto } from '../project-env/project-env.dto';
import * as lodash from 'lodash';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';
import { exec, spawn } from 'child_process';
import * as fs from 'fs';
import { SystemConfig, SystemConfigKeys, SystemConfigValues } from '../system-config/system-config.entity';
import { ProjectLog, ProjectLogType } from '../project-log/project-log.entity';
import { ProjectLogText } from '../project-log/project-log-text.entity';
import { ProjectEnvLogText } from '../project-env-log/project-env-log-text.entity';
import { ProjectEnvLog, ProjectEnvLogType } from '../project-env-log/project-env-log.entity';
import * as path from 'path';

@Controller()
export class ProjectController {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectDeployFile)
    private projectDeployFileRepository: Repository<ProjectDeployFile>,
    @InjectRepository(ProjectEnv)
    private projectEnvRepository: Repository<ProjectEnv>,
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
    @InjectRepository(ProjectLogText)
    private projectLogTextRepository: Repository<ProjectLogText>,
    @InjectRepository(ProjectEnvLog)
    private projectEnvLogRepository: Repository<ProjectEnvLog>,
    @InjectRepository(ProjectEnvLogText)
    private projectEnvLogTextRepository: Repository<ProjectEnvLogText>,
  ) {
  }

  @Get('/api/projects/page')
  async page(@Query() dto: ProjectDto) {
    const r = new ApiResult();
    const p = new Page();


    const projectDtoList: ProjectDto[] = [];
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
          for (const projectEnv of projectEnvList) {
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

    // 项目部署文件
    projectDto.projectDeployFileList = await this.projectDeployFileRepository.find({ projectId: dto.id });

    // 项目环境
    const projectEnvDtoList: ProjectEnvDto[] = [];
    const projectEnvList = await this.projectEnvRepository.find({ projectId: project.id });
    for (const projectEnv of projectEnvList) {
      const projectEnvDto = { ...projectEnv } as ProjectEnvDto;
      projectEnvDto.projectEnvServerList = [];
      // 项目环境服务器
      const projectEnvServerList = await this.projectEnvServerRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
      });
      projectEnvServerList.forEach(projectEnvServer => {
        projectEnvDto.projectEnvServerList.push({ ...projectEnvServer } as ProjectEnvServerDto);
      });

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
      projectEnvDtoList.push(projectEnvDto);
    }
    projectDto.projectEnvList = projectEnvDtoList;


    ar.result = projectDto;
    return ar;
  }

  @Post('/api/projects/save')
  @Transaction()
  async save(@Body() dto: ProjectDto, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {

    console.log(dto);

    const ar = new ApiResult();
    let project = new Project();
    project.name = dto.name;
    project.gitUrl = dto.gitUrl;
    project.remotePath = dto.remotePath;
    project.moduleName = dto.moduleName;

    project = await entityManager.save(Project, project);

    if (dto.projectDeployFileList) {
      // DeployFileList
      for (const projectDeployFileDto of dto.projectDeployFileList) {
        const projectDeployFile = new ProjectDeployFile();
        projectDeployFile.projectId = project.id;
        projectDeployFile.projectName = project.name;

        projectDeployFile.isEnable = projectDeployFileDto.isEnable;
        projectDeployFile.localFilePath = projectDeployFileDto.localFilePath;
        await entityManager.save(ProjectDeployFile, projectDeployFile);
      }
    }

    if (dto.projectEnvList) {

      for (const projectEnvDto of dto.projectEnvList) {
        const env = await this.envRepository.findOne({ id: projectEnvDto.envId });
        if (!env) {
          ar.code = ApiHttpCode['3'].code;
          ar.desc = ApiHttpCode['3'].desc + `id : ${projectEnvDto.envId} 环境不存在，请检查`;
          throws(() => ar.desc, ar.desc);
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
      ar.code = ApiHttpCode['2'].code;
      ar.desc = ApiHttpCode['2'].desc + 'project id can be not null';
      return res.json(ar);
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
            // 1. 删除所有子关联表数据
            await ProjectController.deleteProjectEnvChildrenRelationDataByProjectIdAndEnvId(entityManager, project.id, dbProjectEnv.envId);
            // 2. 插入所有子关联表数据
            projectEnvDto.projectId = project.id;
            projectEnvDto.projectName = project.name;
            await this.insertProjectEnvChildrenRelationData(entityManager, projectEnvDto);
            // 3. 更新项目环境
            await entityManager.update(ProjectEnv, dbProjectEnv.id,
              {
                publishBranch: projectEnvDto.publishBranch,
                isSelectBranch: projectEnvDto.isSelectBranch,
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
          projectEnvDto.projectId = project.id;
          projectEnvDto.projectName = project.name;
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
    // 删除部署服务器
    await entityManager.delete(ProjectEnvServer, { projectId, envId });
    // 删除构建命令、构建后命令、同步后命令
    await entityManager.delete(ProjectCommandStep, { projectId, envId });
    // 删除项目环境
    await entityManager.delete(ProjectEnv, { projectId, envId });

  }

  private static async deleteProjectEnvChildrenRelationDataByProjectId(entityManager: EntityManager, projectId: number) {
    // 删除部署服务器
    await entityManager.delete(ProjectEnvServer, { projectId });
    // 删除构建命令、构建后命令、同步后命令
    await entityManager.delete(ProjectCommandStep, { projectId });
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
    const beforeProjectBuildStep = projectEnvDto?.projectCommandStepBuildList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.build;
      return projectBuildStep;
    });
    if (beforeProjectBuildStep) {
      await entityManager.save(ProjectCommandStep, beforeProjectBuildStep);
    }
    // 插入构建后命令
    const afterProjectBuildStep = projectEnvDto?.projectCommandStepBuildAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.buildAfter;
      return projectBuildStep;
    });
    if (afterProjectBuildStep)
      await entityManager.save(ProjectCommandStep, afterProjectBuildStep);
    // 插入同步命令
    const syncProjectBuildStep = projectEnvDto?.projectCommandStepSyncAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = ProjectCommandStepType.sync;
      return projectBuildStep;
    });
    if (syncProjectBuildStep)
      await entityManager.save(ProjectCommandStep, syncProjectBuildStep);
    // 插入部署服务器
    const newProjectEnvServer = [];
    for (const projectEnvServerDto of projectEnvDto?.projectEnvServerList?.filter(projectEnvServerDto => projectEnvServerDto.isSelectServerIp)) {
      const projectEnvServer = new ProjectEnvServer();
      projectEnvServer.envId = projectEnvDto.envId;
      projectEnvServer.projectId = projectEnvDto.projectId;
      projectEnvServer.projectName = projectEnvDto.projectName;
      const server = await entityManager.findOne(Server, { ip: projectEnvServerDto.serverIp });
      projectEnvServer.serverId = server.id;
      projectEnvServer.serverIp = server.ip;
      projectEnvServer.serverName = server.name;
      projectEnvServer.isPublish = projectEnvServerDto.isPublish;

      newProjectEnvServer.push(projectEnvServer);
    }
    if (newProjectEnvServer.length > 0)
      await entityManager.save(ProjectEnvServer, newProjectEnvServer);
    // 插入项目环境
    await entityManager.save(ProjectEnv, projectEnvDto);
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

      const projectInitLogSeq = project.initLogSeq + 1;
      const projectLog = await this.projectLogRepository.save({
        projectId: project.id,
        projectInitLogSeq: projectInitLogSeq,
        type: ProjectLogType.init,
      });


      const jobPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}`;
      const projectPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}`;
      const buildPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}${SystemConfigValues.buildPath}`;
      const gitPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}${SystemConfigValues.git}`;

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
        # 5. 创建项目构建路径
        echo "mkdir -p ${buildPath}";
        mkdir -p ${buildPath};
        # 6. 创建项目 git clone 路径
        echo "mkdir -p ${gitPath}";
        mkdir -p ${gitPath};
        # 7. cd gitPath
        echo "cd ${gitPath}";
        cd ${gitPath}
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


      const logPath = `${installPathSystemConfig.value}/logs`;
      fs.mkdirSync(logPath, { recursive: true });
      const logFile = path.join(logPath, `${ProjectLogFileType.init(projectInitLogSeq)}`);
      const writeStream = fs.createWriteStream(logFile);
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
    const project = await this.projectRepository.findOne(dto.id);
    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });


    const projectEnv = await this.projectEnvRepository.findOne(dto.projectEnvId);
    if (!projectEnv) {
      ar.code = ApiHttpCode['1001'].code;
      ar.desc = ApiHttpCode['1001'].desc;
      return res.json(ar);
    }
    const projectEnvBuildSeq = projectEnv.buildSeq + 1;

    const projectEnvLog = await this.projectEnvLogRepository.save({
      type: ProjectEnvLogType.build,
      projectId: project.id,
      projectEnvId: projectEnv.id,
      projectEnvLogSeq: projectEnvBuildSeq,
    } as ProjectEnvLog);


    const buildProjectCommandStepList = await this.projectCommandStepRepository.find({
      envId: projectEnv.envId,
      projectId: project.id,
      type: ProjectCommandStepType.build,
    });

    const buildAfterProjectCommandStepList = await this.projectCommandStepRepository.find({
      envId: projectEnv.envId,
      projectId: project.id,
      type: ProjectCommandStepType.buildAfter,
    });

    // const writeStream = fs.createWriteStream(`${installPathSystemConfig.value}${SystemConfigValues.logPath}/#${projectEnvBuildSeq}.log`);
    // 组装构建shell
    // 1. 构建开始
    // 2. cd 项目路径
    // 3. 切换到构建分支、还原代码（git）
    // 4. 执行构建命令
    // 5. 不同环境构建成功
    // let shell = `
    //   echo "Start of build project(${project.name}).";
    //   echo "cd ${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}";
    //   cd ${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name};
    // `;
    // for (const projectBuildStep of buildProjectCommandStepList) {
    //   shell += `echo "${projectBuildStep.step}";`;
    //   shell += `${projectBuildStep.step};`;
    // }


    // const child = exec(shell);
    // child.stdout.on('data', async (data) => {
    //   await ProjectController.saveProjectEnvLogText(projectEnvLog.id, data, this.projectEnvLogTextRepository);
    //   await writeStream.write(data);
    // });
    // child.stdout.on('end', async () => {
    //   setTimeout(async () => {
    //     await this.projectEnvRepository.update(projectEnv.id, { buildSeq: projectEnvBuildSeq });
    //     await ProjectController.saveProjectEnvLogText(projectEnvLog.id, `\nEnd of build project(${project.name}) .`, this.projectEnvLogTextRepository);
    //     writeStream.write(`End of build project(${project.name}) .`);
    //   }, 2000);
    // });
    return res.json(ar);
  }

  private static async saveProjectLogText(projectLogId: number, text: string, projectLogTextRepository) {
    if (!text && text.length > 0) {
      console.log(text);
      await projectLogTextRepository.save({ projectLogId: projectLogId, text: text } as ProjectLogText);
    }
  }


  private static async saveProjectEnvLogText(projectEnvLogId: number, text: string, projectEnvLogTextRepository) {
    console.log(text);
    // await projectEnvLogTextRepository.save({
    //   projectEnvLogId: projectEnvLogId,
    //   text: text,
    // } as ProjectEnvLogText);
  }
}
