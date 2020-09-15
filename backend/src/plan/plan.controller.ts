import { Response } from 'express';
import { Body, Controller, Delete, Get, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Env } from '../env/env.entity';
import { PlanDto } from './plan.dto';
import { Project } from '../project/project.entity';

import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { Plan } from './plan.entity';
import { PlanEnvProjectConfigServer, PlanEnvProjectConfigServerType } from './plan-env-project-config-server.entity';
import { PlanEnv } from './plan-env.entity';
import { PlanScript } from './plan-script.entity';

import { Page } from '../common/page';
import { ServerDto } from '../server/server.dto';
import { UserAuth, UserAuthOperation } from '../user/user-auth';
import { PlanEnvDto } from './plan-env.dto';
import { PlanEnvProjectConfigDto } from './plan-env-project-config.dto';
import { PlanScriptDto } from './plan-script.dto';

import { PlanProjectSort } from './plan-project-sort.entity';
import { Server } from '../server/server.entity';
import { PluginEureka } from '../plugin/plugin.entity';
import { PluginEurekaService } from '../plugin-api/eureka/plugin-eureka.service';
import { PluginEnvSetting } from '../plugin/plugin-env-setting.entity';
import { PluginEurekaConfig } from '../plugin-api/eureka/plugin-eureka-config';
import { PluginEurekaApplicationInstanceStatus } from '../plugin-api/eureka/plugin-eureka.dto';
import { sleep } from '../common/utils';
import { ProjectService } from '../project/project.service';
import { ProjectEnvLog } from '../project-env-log/project-env-log.entity';
import { ProjectEnv } from '../project-env/project-env.entity';

@Controller()
export class PlanController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectEnvLog)
    private projectEnvLogRepository: Repository<ProjectEnvLog>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(PlanProjectSort)
    private planProjectSortRepository: Repository<PlanProjectSort>,
    @InjectRepository(PlanScript)
    private planScriptRepository: Repository<PlanScript>,
    @InjectRepository(PlanEnv)
    private planEnvRepository: Repository<PlanEnv>,
    @InjectRepository(PlanEnvProjectConfig)
    private planEnvProjectConfigRepository: Repository<PlanEnvProjectConfig>,
    @InjectRepository(PlanEnvProjectConfigServer)
    private planEnvProjectConfigServerRepository: Repository<PlanEnvProjectConfigServer>,
    @InjectRepository(PluginEnvSetting)
    private pluginEnvSettingRepository: Repository<PluginEnvSetting>,
    @InjectRepository(ProjectEnv)
    private projectEnvRepository: Repository<ProjectEnv>,
    private jwtService: JwtService,
    private pluginEurekaService: PluginEurekaService,
    private projectService: ProjectService,
  ) {
  }

  @Get('/api/plans/project-sort-list')
  async projectSortList(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    const projectList = await this.projectRepository.find();
    const projectIdList = projectList.map(project => project.id);
    const projectSortList = await this.planProjectSortRepository.find();
    const projectSortIdList = projectSortList.map(projectSort => projectSort.projectId);

    // 项目存在 而 版本计划项目排序不存在，需要把项目保存到版本计划项目排序中
    for (const project of projectList) {
      if (projectSortIdList.indexOf(project.id) === -1) {
        const planProjectSort = new PlanProjectSort();
        planProjectSort.sort = 9999;
        planProjectSort.projectId = project.id;
        planProjectSort.projectName = project.name;
        await this.planProjectSortRepository.save(planProjectSort);
      }
    }

    // 当版本计划项目排序存在 而 项目不存在，需要把版本计划项目排序删除
    for (const projectSort of projectSortList) {
      if (projectIdList.indexOf(projectSort.projectId) === -1) {
        await this.planProjectSortRepository.delete(projectSort.id);
      }
    }


    ar.result = await this.planProjectSortRepository.createQueryBuilder('pps').addOrderBy('sort', 'ASC').getMany();


    return res.json(ar);
  }

  @Post('/api/plans/project-sort-setting')
  @Transaction()
  async projectSortSave(@Body() planProjectSortList: PlanProjectSort[], @Req() req, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    for (const planProjectSort of planProjectSortList) {
      await entityManager.update(PlanProjectSort, { projectId: planProjectSort.projectId }, { sort: planProjectSort.sort });
    }
    return res.json(ar);
  }

  /**
   * 灰度发布
   * @param dto
   * @param res
   */
  @Post('/api/plans/gray-publish')
  async grayPublish(@Body() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    if (!dto.id) {
      ar.param(ApiResultCode['2'], '版本计划：id 不能为空');
      return res.json(ar);
    }

    const plan = await this.planRepository.findOne(dto.id);

    const commonPlanEnvProjectConfig = await this.planEnvProjectConfigRepository.findOne({
      planId: plan.id,
      planEnvId: dto.envId,
      type: 1,
    });

    // 项目配置
    const planEnvProjectConfigList = await this.planEnvProjectConfigRepository.find({
      planId: plan.id,
      planEnvId: dto.envId,
      type: 2,
    });


    const pluginEnvSetting = await this.pluginEnvSettingRepository.findOne({
      pluginName: PluginEureka.name,
      envId: dto.envId,
    });


    const pluginEurekaConfig: PluginEurekaConfig = JSON.parse(pluginEnvSetting.config);


    for (const planEnvProjectConfig of planEnvProjectConfigList) {
      // 当开启自定义配置
      if (planEnvProjectConfig.isEnableCustomConfig) {
        const grayServerList = await this.planEnvProjectConfigServerRepository.find({
          planId: plan.id,
          type: 1,
          planEnvProjectConfigId: planEnvProjectConfig.id,
        });
        console.log('grayServerList', grayServerList);
      }
      // 使用公共配置
      else {

        const grayServerList = await this.planEnvProjectConfigServerRepository.find({
          planEnvProjectConfigId: commonPlanEnvProjectConfig.id,
          type: 1,
        });
        const publishServerIpList = grayServerList.filter(value => value.serverId === commonPlanEnvProjectConfig.publishServerId).map(value => (value.serverIp));
        console.log('publishServerIpList', publishServerIpList);
        // 1.1 Eureka下线发布服务器
        if (commonPlanEnvProjectConfig.registerCenterName === PluginEureka.name) {
          while (true) {
            console.log('planEnvProjectConfig', planEnvProjectConfig);
            const app = await this.pluginEurekaService.app({ app: planEnvProjectConfig.projectName }, pluginEurekaConfig);
            console.log('app', app);

            const publishServerEurekaAppInstance = app.application.instance.filter(instance => publishServerIpList.indexOf(instance.ipAddr) != -1);
            const upPublishServerEurekaAppInstance = publishServerEurekaAppInstance.filter(value => value.status === PluginEurekaApplicationInstanceStatus.UP);
            // 当注册中心应用下线了结束下线处理
            if (upPublishServerEurekaAppInstance.length === 0) {
              break;
            }
            for (const upInstance of upPublishServerEurekaAppInstance) {
              upInstance.status = PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE;
              await this.pluginEurekaService.changeStatus(upInstance, pluginEurekaConfig);
            }
            await sleep(30000);
          }
        }
        // 1.2 发布发布服务器项目
        console.log('发布服务器应用下线完成，现在发布应用');
        while (true) {
          await this.projectService.build({
            projectId: planEnvProjectConfig.projectId,
            publicBranch: plan.name,
            serverId: commonPlanEnvProjectConfig.publishServerId,
            envId: dto.envId,
          });

          const projectEnv = await this.projectEnvRepository.findOne({
            projectId: planEnvProjectConfig.projectId,
            envId: dto.envId,
          });


          if (projectEnv.isFinish) {
            break;
          }
          await sleep(30000);
        }


        // 1. 先下线注册中心需要发布的所有项目
        // 发布服务器在注册中心里先下线，并且确认是否可以发布项目
        // 当注册中心使用Eureka时
        // if (commonPlanEnvProjectConfig.registerCenterName === PluginEureka.name) {
        //   while (true) {
        //     const app = await this.pluginEurekaService.app({ app: planEnvProjectConfig.projectName }, pluginEurekaConfig);
        //     const grayServerIpList = grayServerList.map(value => (value.serverIp));
        //     const publishServerEurekaAppInstance = app.application.instance.filter(instance => grayServerIpList.indexOf(instance.ipAddr) != -1);
        //     const upPublishServerEurekaAppInstance = publishServerEurekaAppInstance.filter(value => value.status === PluginEurekaApplicationInstanceStatus.UP);
        //     // 当注册中心应用
        //     if (upPublishServerEurekaAppInstance.length === 0) {
        //       break;
        //     }
        //     for (const upInstance of upPublishServerEurekaAppInstance) {
        //       upInstance.status = PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE;
        //       await this.pluginEurekaService.changeStatus(upInstance, pluginEurekaConfig);
        //     }
        //     await sleep(30000);
        //   }
        // }


      }
    }
    // 2. 按照项目发布顺序发布项目


    // 3. 发布完成后，注册中心每个项目手动上线
    return res.json(ar);
  }

  @Get('/api/plans/info')
  async info(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    if (!dto.id) {
      ar.param(ApiResultCode['2'], '版本计划：id 不能为空');
      return res.json(ar);
    }


    const plan = await this.planRepository.findOne(dto.id) as PlanDto;
    const planEnvList = await this.planEnvRepository.find({ planId: plan.id }) as PlanEnvDto[];
    for (const planEnvDto of planEnvList) {


      const planEnvProjectConfigList = await this.planEnvProjectConfigRepository.createQueryBuilder('pepc').where('planId = :planId and planEnvId = :planEnvId', {
        planId: plan.id,
        planEnvId: planEnvDto.envId,
      }).addOrderBy('projectSort', 'ASC').getMany() as PlanEnvProjectConfigDto[];

      for (const planEnvProjectConfigDto of planEnvProjectConfigList) {

        const grayServerList = await this.planEnvProjectConfigServerRepository.find({
          planEnvProjectConfigId: planEnvProjectConfigDto.id,
          type: PlanEnvProjectConfigServerType.gray.code,
        });
        if (grayServerList) {
          planEnvProjectConfigDto.grayServerList = grayServerList;
          planEnvProjectConfigDto.grayServerIdList = grayServerList.map(planEnvProjectConfigServer => planEnvProjectConfigServer.serverId);
        }

        const releaseServerList = await this.planEnvProjectConfigServerRepository.find({
          planEnvProjectConfigId: planEnvProjectConfigDto.id,
          type: PlanEnvProjectConfigServerType.release.code,
        });
        if (releaseServerList) {
          planEnvProjectConfigDto.releaseServerList = releaseServerList;
          planEnvProjectConfigDto.releaseServerIdList = releaseServerList.map(planEnvProjectConfigServer => planEnvProjectConfigServer.serverId);
        }
      }

      planEnvDto.planEnvProjectConfigList = planEnvProjectConfigList;
    }
    plan.planEnvList = planEnvList;
    plan.planScriptList = await this.planScriptRepository.find({ planId: plan.id }) as PlanScriptDto[];
    ar.result = plan;

    return res.json(ar);
  }

  @Get('/api/plans/page')
  async page(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    const page = new Page<PlanDto>();
    await this.planRepository.createQueryBuilder('s').orderBy('id', 'DESC')
      .skip(PlanDto.getOffset(PlanDto.getPageNo(dto.pageNo), ServerDto.getPageSize(dto.pageSize)))
      .take(PlanDto.getPageSize(dto.pageSize))
      .getManyAndCount()
      .then(value => {
        page.data = value[0] as PlanDto[];
        page.total = value[1];
      });
    // 版本计划环境列表
    for (const planDto of page.data) {
      planDto.planEnvList = await this.planEnvRepository.find({ planId: planDto.id }) as PlanEnvDto[];
    }
    page.pageNo = dto.pageNo;
    page.pageSize = dto.pageSize;
    // 分页总数，总记录数 / 页条数，当存在小数点，使用了 Math.ceil 直接网上取整数
    page.totalPage = Math.ceil(page.total / page.pageSize);
    ar.result = page;
    return res.json(ar);
  }

  @Post('/api/plans/save')
  @Transaction()
  async save(@Body() dto: PlanDto, @Req() req, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    let plan = new Plan();
    plan.name = dto.name;
    plan.publishVersion = dto.publishVersion;
    plan = await entityManager.save(Plan, plan);
    await this.insert(dto, plan, entityManager);


    return res.json(ar);
  }

  @Put('/api/plans/update')
  @Transaction()
  async update(@Body() dto: PlanDto, @Req() req, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    if (!dto.id) {
      ar.param(ApiResultCode['2'], '版本计划：id 不能为空');
      return res.json(ar);
    }
    const plan = await entityManager.findOne(Plan, dto.id);
    if (!plan) {
      ar.remindRecordNotExist(Env.entityName, { id: dto.id });
      return res.json(ar);
    }
    // 删除 PlanEnvProjectConfigServer
    await entityManager.delete(PlanEnvProjectConfigServer, { planId: plan.id });
    // 删除 PlanEnvProjectConfig
    await entityManager.delete(PlanEnvProjectConfig, { planId: plan.id });
    // 删除 PlanEnv
    await entityManager.delete(PlanEnv, { planId: plan.id });
    // 删除 PlanScript
    await entityManager.delete(PlanScript, { planId: plan.id });

    await this.insert(dto, plan, entityManager);

    await entityManager.update(Plan, plan.id, { name: dto.name });

    return res.json(ar);
  }

  @Delete('/api/plans/delete')
  async delete(@Body() dto: PlanDto, @Req() req, @Res() res: Response) {
    const ar = new ApiResult();

    const accessToken = req.header(UserAuthOperation.accessTokenKey);
    const userAuth = this.jwtService.decode(accessToken.toString()) as UserAuth;
    // 非管理员 无权限删除
    if (userAuth.roleType !== 0) {
      ar.remind(ApiResultCode['12']);
      return res.json(ar);
    }

    const plan = await this.planRepository.findOne(dto.id);
    if (!plan) {
      ar.remindRecordNotExist(Env.entityName, { id: dto.id });
      return res.json(ar);
    }
    await this.planRepository.delete(dto.id);

    return res.json(ar);
  }

  async insert(dto: PlanDto, plan: Plan, entityManager: EntityManager) {
    for (const planEnvDto of dto.planEnvList) {

      for (const planEnvProjectConfigDto of planEnvDto.planEnvProjectConfigList) {
        let planEnvProjectConfig = { ...planEnvProjectConfigDto } as PlanEnvProjectConfig;

        planEnvProjectConfig.planId = plan.id;
        planEnvProjectConfig.planName = plan.name;
        planEnvProjectConfig.planEnvId = planEnvDto.envId;
        planEnvProjectConfig.planEnvName = planEnvDto.envName;
        if (planEnvProjectConfig.publishServerId) {
          const server = await entityManager.findOne(Server, planEnvProjectConfig.publishServerId);
          planEnvProjectConfig.publishServerName = server.name;
        }

        planEnvProjectConfig = await entityManager.save(PlanEnvProjectConfig, planEnvProjectConfig);

        if (planEnvProjectConfigDto.isEnableCustomConfig) {
          if (planEnvProjectConfigDto.grayServerIdList) {
            for (const grayServerId of planEnvProjectConfigDto.grayServerIdList) {

              const server = await entityManager.findOne(Server, grayServerId);

              const planEnvProjectConfigServer = new PlanEnvProjectConfigServer();
              planEnvProjectConfigServer.planId = plan.id;
              planEnvProjectConfigServer.planEnvProjectConfigId = planEnvProjectConfig.id;
              planEnvProjectConfigServer.serverId = grayServerId;
              planEnvProjectConfigServer.serverIp = server.ip;
              planEnvProjectConfigServer.serverName = server.name;
              planEnvProjectConfigServer.type = PlanEnvProjectConfigServerType.gray.code;
              await entityManager.save(PlanEnvProjectConfigServer, planEnvProjectConfigServer);
            }
          }
          if (planEnvProjectConfigDto.releaseServerIdList) {
            for (const releaseServerId of planEnvProjectConfigDto?.releaseServerIdList) {
              const planEnvProjectConfigServer = new PlanEnvProjectConfigServer();

              const server = await entityManager.findOne(Server, releaseServerId);

              planEnvProjectConfigServer.planId = plan.id;
              planEnvProjectConfigServer.planEnvProjectConfigId = planEnvProjectConfig.id;
              planEnvProjectConfigServer.serverId = releaseServerId;
              planEnvProjectConfigServer.serverName = server.name;
              planEnvProjectConfigServer.serverIp = server.ip;
              planEnvProjectConfigServer.type = PlanEnvProjectConfigServerType.release.code;
              // await entityManager.save(PlanEnvProjectConfigServer, planEnvProjectConfigServer);
            }
          }
        }
      }

      const planEnv = { ...planEnvDto } as PlanEnv;
      planEnv.planId = plan.id;
      planEnv.planName = plan.name;
      await entityManager.save(PlanEnv, planEnv);
    }

    for (const planScriptDto of dto.planScriptList) {
      const planScript = { ...planScriptDto } as PlanScript;
      planScript.planId = plan.id;
      planScript.planName = plan.name;
      await entityManager.save(PlanScript, planScript);
    }
  }


}