import { Body, Controller, Delete, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Env } from '../env/env.entity';
import { PlanDto } from './plan.dto';
import { Project } from '../project/project.entity';
import { UserDto } from '../user/user.dto';
import { PlanEnvProjectConfig } from './plan-env-project-config.entity';
import { Plan } from './plan.entity';
import { PlanEnvProjectConfigServer, PlanEnvProjectConfigServerType } from './plan-env-project-config-server.entity';
import { PlanEnv } from './plan-env.entity';
import { PlanScript } from './plan-script.entity';
import { EnvDto } from '../env/env.dto';
import { Page } from '../common/page';
import { ServerDto } from '../server/server.dto';
import { UserAuth, UserAuthOperation } from '../user/user-auth';
import { PlanEnvDto } from './plan-env.dto';
import { PlanEnvProjectConfigDto } from './plan-env-project-config.dto';

@Controller()
export class PlanController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(PlanEnv)
    private planEnvRepository: Repository<PlanEnv>,
    @InjectRepository(PlanEnvProjectConfig)
    private planEnvProjectConfigRepository: Repository<PlanEnvProjectConfig>,
    @InjectRepository(PlanEnvProjectConfigServer)
    private planEnvProjectConfigServerRepository: Repository<PlanEnvProjectConfigServer>,
    private jwtService: JwtService,
  ) {
  }

  @Get('/api/plans/project-list')
  async list(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectRepository.createQueryBuilder('p').select(['p.id', 'p.name']).getMany();
    return res.json(ar);
  }

  @Get('/api/plans/info')
  async info(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    const plan = await this.planRepository.findOne(dto.id) as PlanDto;
    const planEnvList = await this.planEnvRepository.find({ planId: plan.id }) as PlanEnvDto[];
    for (const planEnvDto of planEnvList) {
      const planEnvProjectConfigList = await this.planEnvProjectConfigRepository.find({
        planId: plan.id,
        planEnvId: planEnvDto.envId,
      }) as PlanEnvProjectConfigDto[];

      for (const planEnvProjectConfigDto of planEnvProjectConfigList) {
        planEnvProjectConfigDto.garyServerIdList = await this.planEnvProjectConfigServerRepository.find({
          planEnvProjectConfigId: planEnvProjectConfigDto.id,
          type: PlanEnvProjectConfigServerType.gray.code,
        }).then((planEnvProjectConfigServerList) => planEnvProjectConfigServerList.map(planEnvProjectConfigServer => planEnvProjectConfigServer.serverId));
        planEnvProjectConfigDto.releaseServerIdList = await this.planEnvProjectConfigServerRepository.find({
          planEnvProjectConfigId: planEnvProjectConfigDto.id,
          type: PlanEnvProjectConfigServerType.release.code,
        }).then((planEnvProjectConfigServerList) => planEnvProjectConfigServerList.map(planEnvProjectConfigServer => planEnvProjectConfigServer.serverId));
      }

      planEnvDto.planEnvProjectConfigList = planEnvProjectConfigList;
    }
    plan.planEnvList = planEnvList;
    ar.result = plan;

    return res.json(ar);
  }

  @Get('/api/plans/page')
  async page(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    const page = new Page();
    await this.planRepository.createQueryBuilder('s')
      .skip(PlanDto.getOffset(PlanDto.getPageNo(dto.pageNo), ServerDto.getPageSize(dto.pageSize)))
      .take(PlanDto.getPageSize(dto.pageSize))
      .getManyAndCount()
      .then(value => {
        page.data = value[0];
        page.total = value[1];
      });
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
    plan = await entityManager.save(Plan, plan);


    for (const planEnvDto of dto.planEnvList) {

      for (const planEnvProjectConfigDto of planEnvDto.planEnvProjectConfigList) {
        let planEnvProjectConfig = { ...planEnvProjectConfigDto } as PlanEnvProjectConfig;

        planEnvProjectConfig.planId = plan.id;
        planEnvProjectConfig.planName = plan.name;
        planEnvProjectConfig.planEnvId = planEnvDto.envId;
        planEnvProjectConfig.planEnvName = planEnvDto.envName;
        planEnvProjectConfig = await entityManager.save(PlanEnvProjectConfig, planEnvProjectConfig);

        if (planEnvProjectConfigDto.isEnableCustomConfig) {
          for (const grayServerId of planEnvProjectConfigDto.garyServerIdList) {
            const planEnvProjectConfigServer = new PlanEnvProjectConfigServer();
            planEnvProjectConfigServer.planEnvProjectConfigId = planEnvProjectConfig.id;
            planEnvProjectConfigServer.serverId = grayServerId;
            planEnvProjectConfigServer.type = PlanEnvProjectConfigServerType.gray.code;
            await entityManager.save(PlanEnvProjectConfigServer, planEnvProjectConfigServer);
          }

          for (const releaseServerId of planEnvProjectConfigDto.releaseServerIdList) {
            const planEnvProjectConfigServer = new PlanEnvProjectConfigServer();
            planEnvProjectConfigServer.planEnvProjectConfigId = planEnvProjectConfig.id;
            planEnvProjectConfigServer.serverId = releaseServerId;
            planEnvProjectConfigServer.type = PlanEnvProjectConfigServerType.release.code;
            await entityManager.save(PlanEnvProjectConfigServer, planEnvProjectConfigServer);
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


}