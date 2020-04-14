import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager, TransactionRepository } from 'typeorm';
import { Project } from './project.entity';
import { Page } from '../common/page';
import { ApiHttpCode, ApiResult } from '../common/api-result';
import { Response } from 'express';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnv } from '../project-env/project-env.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { ProjectBuildStep } from '../project-build-step/project-build-step.entity';
import { Env } from '../env/env.entity';
import { throws } from 'assert';
import { ProjectEnvDto } from '../project-env/project-env.dto';
import * as lodash from 'lodash';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';

@Controller()
export class ProjectController {

  constructor(
    @InjectRepository(Project)
    @TransactionRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectDeployFile)
    @TransactionRepository(ProjectDeployFile)
    private projectDeployFileRepository: Repository<ProjectDeployFile>,
    @InjectRepository(ProjectEnv)
    @TransactionRepository(ProjectEnv)
    private projectEnvRepository: Repository<ProjectEnv>,
    @InjectRepository(ProjectEnvServer)
    @TransactionRepository(ProjectEnvServer)
    private projectEnvServerRepository: Repository<ProjectEnvServer>,
    @InjectRepository(Server)
    @TransactionRepository(Server)
    private serverRepository: Repository<Server>,
    @TransactionRepository(ProjectBuildStep)
    @InjectRepository(ProjectBuildStep)
    private projectBuildStepRepository: Repository<ProjectBuildStep>,
    @TransactionRepository(Env)
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
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
      projectEnvDto.projectBuildBeforeList = await this.projectBuildStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: 0,
      });
      // 项目构建后命令
      projectEnvDto.projectBuildAfterList = await this.projectBuildStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: 1,
      });
      // 项目同步后命令
      projectEnvDto.projectSyncAfterList = await this.projectBuildStepRepository.find({
        projectId: project.id,
        envId: projectEnv.envId,
        type: 2,
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
        await ProjectController.insertProjectEnvChildrenRelationData(entityManager, project.id, projectEnvDto);
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
            await ProjectController.insertProjectEnvChildrenRelationData(entityManager, project.id, projectEnvDto);
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
          await ProjectController.insertProjectEnvChildrenRelationData(entityManager, project.id, projectEnvDto);
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
    await entityManager.delete(ProjectBuildStep, { projectId, envId });
    // 删除项目环境
    await entityManager.delete(ProjectEnv, { projectId, envId });

  }

  private static async deleteProjectEnvChildrenRelationDataByProjectId(entityManager: EntityManager, projectId: number) {
    // 删除部署服务器
    await entityManager.delete(ProjectEnvServer, { projectId });
    // 删除构建命令、构建后命令、同步后命令
    await entityManager.delete(ProjectBuildStep, { projectId });
    // 删除项目环境
    await entityManager.delete(ProjectEnv, { projectId });
  }

  /**
   * 插入项目环境子关联表数据
   * @param entityManager
   * @param projectId
   * @param projectEnvDto
   */
  private static async insertProjectEnvChildrenRelationData(entityManager: EntityManager, projectId: number, projectEnvDto: ProjectEnvDto) {
    projectEnvDto.projectId = projectId;
    // 插入构建命令
    const beforeProjectBuildStep = projectEnvDto?.projectBuildBeforeList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = 0;
      return projectBuildStep;
    });
    if (beforeProjectBuildStep) {
      await entityManager.save(ProjectBuildStep, beforeProjectBuildStep);
    }
    // 插入构建后命令
    const afterProjectBuildStep = projectEnvDto?.projectBuildAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = 1;
      return projectBuildStep;
    });
    if (afterProjectBuildStep)
      await entityManager.save(ProjectBuildStep, afterProjectBuildStep);
    // 插入同步命令
    const syncProjectBuildStep = projectEnvDto?.projectSyncAfterList?.map(projectBuildStep => {
      projectBuildStep.envId = projectEnvDto.envId;
      projectBuildStep.projectId = projectEnvDto.projectId;
      projectBuildStep.type = 2;
      return projectBuildStep;
    });
    if (syncProjectBuildStep)
      await entityManager.save(ProjectBuildStep, syncProjectBuildStep);
    // 插入部署服务器
    const newProjectEnvServer = [];
    for (const projectEnvServerDto of projectEnvDto?.projectEnvServerList?.filter(projectEnvServerDto => projectEnvServerDto.isSelectServerIp)) {
      const projectEnvServer = new ProjectEnvServer();
      projectEnvServer.envId = projectEnvDto.envId;
      projectEnvServer.projectId = projectEnvDto.projectId;
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
}
