import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../common/api-result';
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

@Controller()
export class PlanController {

  constructor(
    @InjectRepository(Env)
    private envRepository: Repository<Env>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(PlanEnvProjectConfig)
    private planEnvProjectConfigRepository: Repository<PlanEnvProjectConfig>,
    private jwtService: JwtService,
  ) {
  }

  @Get('/api/plans/project-list')
  async list(@Query() dto: PlanDto, @Res() res: Response) {
    const ar = new ApiResult();
    ar.result = await this.projectRepository.createQueryBuilder('p').select(['p.id', 'p.name']).getMany();
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

        if(planEnvProjectConfigDto.isEnableCustomConfig) {
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


}