import { Body, Controller, Get, HttpCode, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { SystemConfig, SystemConfigKeys } from './system-config.entity';
import { InstallDto } from './install.dto';
import { User, UserRoleType } from '../user/user.entity';
import { v4 as UUID } from 'uuid';

/**
 * 系统
 */
@Controller()
export class SystemController {
  constructor(
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
  ) {
  }

  @Get('/api/systems/installed')
  @Transaction()
  async installed(@Body() dto: InstallDto, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    const installed = await entityManager.findOne(SystemConfig, { key: SystemConfigKeys.installed });
    // 系统安装未安装
    if (!installed) {
      ar.remind(ApiResultCode['11']);
      return res.json(ar);
    }


    return res.json(ar);
  }


  @Post('/api/systems/install')
  @HttpCode(200)
  @Transaction()
  async install(@Body() dto: InstallDto, @Res() res: Response, @TransactionManager() entityManager: EntityManager) {
    const ar = new ApiResult();
    if (!dto.username) {
      ar.param(ApiResultCode['2'], '用户名不能为空');
      return res.json(ar);
    }

    if (!dto.password) {
      ar.param(ApiResultCode['2'], '密码不能为空');
      return res.json(ar);
    }
    if (!dto.installPath) {
      ar.param(ApiResultCode['2'], '安装路径不能为空');
      return res.json(ar);
    }

    // 用户
    let user = await entityManager.findOne(User, { username: dto.username });
    if (!user) {
      user = new User();
    }
    user.username = dto.username.trim();
    user.roleType = UserRoleType.superAdmin;
    user.passwordSalt = UUID();
    user.password = User.getMd5Password(user.passwordSalt, dto.password.trim());
    await entityManager.save(User, user);

    // 安装路径
    let installPathSystemConfig = await entityManager.findOne(SystemConfig, { key: SystemConfigKeys.installPath });
    if (!installPathSystemConfig) {
      installPathSystemConfig = new SystemConfig();
    }
    installPathSystemConfig.key = SystemConfigKeys.installPath;
    installPathSystemConfig.value = dto.installPath;
    await entityManager.save(SystemConfig, installPathSystemConfig);

    // 已安装标识
    let installedSystemConfig = await entityManager.findOne(SystemConfig, { key: SystemConfigKeys.installed });
    if (!installedSystemConfig) {
      installedSystemConfig = new SystemConfig();
    }
    installedSystemConfig.key = SystemConfigKeys.installed;
    installedSystemConfig.value = '1';
    await entityManager.save(SystemConfig, installedSystemConfig);


    return res.json(ar);
  }

}
