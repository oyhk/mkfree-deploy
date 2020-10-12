import { SystemConfig, SystemConfigKeys, SystemConfigValues } from '../system-config/system-config.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { Project, ProjectLogFileType } from './project.entity';
import { ApiResultCode } from '../common/api-result';
import { ProjectEnv } from '../project-env/project-env.entity';
import { Env } from '../env/env.entity';
import { ProjectEnvLog, ProjectEnvLogType } from '../project-env-log/project-env-log.entity';
import { ProjectCommandStep, ProjectCommandStepType } from '../project-build-step/project-command-step.entity';
import * as fs from 'fs';
import { exec } from 'child_process';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Plugin } from '../plugin/plugin.entity';
import { ProjectPlugin } from '../project-plugin/project-plugin.entity';
import { ProjectDeployFile } from '../project-deploy-file/project-deploy-file.entity';
import { ProjectEnvPlugin } from '../project-env-plugin/project-env-plugin.entity';
import { ProjectLog } from '../project-log/project-log.entity';
import { ApiException } from '../common/api.exception';
import { PluginEurekaConfig } from '../plugin-api/eureka/plugin-eureka-config';
import { PluginEurekaApplicationInstanceStatus } from '../plugin-api/eureka/plugin-eureka.dto';
import { sleep } from '../common/utils';
import { PluginEurekaService } from '../plugin-api/eureka/plugin-eureka.service';

@Injectable()
export class ProjectService {

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
    private pluginEurekaService: PluginEurekaService,
    private jwtService: JwtService,
  ) {
  }


  /**
   * 项目构建
   * @param dto
   */
  async build(dto: { projectId: number, publicBranch: string, serverId: number, envId: number }) {
    const publishTime = new Date();
    let publishBranch = dto.publicBranch;

    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });

    const projectEnvServer = await this.projectEnvServerRepository.findOne({
      projectId: dto.projectId,
      envId: dto.envId,
      serverId: dto.serverId,
    });

    if (!projectEnvServer) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnvServer.entityName} params ${JSON.stringify({
        projectId: dto.projectId,
        envId: dto.envId,
        serverId: dto.serverId,
      })}, record does not exist.`));
    }

    const server = await this.serverRepository.findOne({ id: projectEnvServer.serverId });
    if (!server) {
      throw new ApiException(ApiResultCode['3'](`${Server.entityName} params serverId:${dto.serverId}, record does not exist.`));
    }
    const project = await this.projectRepository.findOne(dto.projectId);

    if (!project) {
      throw new ApiException(ApiResultCode['3'](`${Project.entityName} params projectId:${dto.projectId}, record does not exist.`));
    }
    if (project.state !== 2) {
      throw new ApiException(ApiResultCode['1001']);
    }

    const projectEnv = await this.projectEnvRepository.findOne({
      projectId: dto.projectId,
      envId: dto.envId,
    });

    if (!projectEnv) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnv.entityName} params envId:${dto.envId}, record does not exist.`));
    }
    if (!publishBranch) {
      publishBranch = projectEnv.publishBranch;
    }
    const publishBranchDirName = publishBranch?.replace('/', '_');

    const env = await this.envRepository.findOne(projectEnv.envId);
    if (!env) {
      throw new ApiException(ApiResultCode['3'](`${Env.entityName} params:${dto.envId}, record does not exist.`));
    }

    const projectEnvBuildSeq = projectEnv.buildSeq + 1;

    // 首先更新环境正在发布中
    await this.projectEnvRepository.update(projectEnv.id, { isFinish: false });

    const projectEnvLog = await this.projectEnvLogRepository.save({
      type: ProjectEnvLogType.build.code,
      projectId: project.id,
      projectName: project.name,
      envId: env.id,
      projectEnvId: projectEnv.id,
      projectEnvLogSeq: projectEnvBuildSeq,
      serverId: server.id,
      serverName: server.name,
      serverIp: server.ip,
      isFinish: false,
      publishTime,
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
    const logPath = `${installPathSystemConfig.value}/logs/${project.name}`;
    const projectEnvPath = `${installPathSystemConfig.value}${SystemConfigValues.jobPath}/${project.name}/${env.code}`;

    const projectEnvPathExist = fs.existsSync(projectEnvPath);
    if (!projectEnvPathExist) {
      throw new ApiException(ApiResultCode['1002']);
    }
    fs.mkdirSync(logPath, { recursive: true });
    const writeStream = fs.createWriteStream(`${logPath}/${ProjectLogFileType.build(env.code, projectEnvBuildSeq)}`);
    // 服务器信息
    const sshUsername = server.sshUsername;
    const sshPort = server.sshPort;
    const ip = server.ip;

    // 修改项目环境服务器当前发布版本信息
    const gitVersionShell = `
        gitVersion="$(git log -n 1)"
        gitVersion=\$\{gitVersion:27:20\}
        echo $gitVersion
      `;
    exec(gitVersionShell, { cwd: projectEnvPath }, async (error, stdoutData, stderrData) => {
      const publishVersion = `${publishBranchDirName}_${stdoutData.replace('\n', '')}`;
      // 修改项目环境服务器当前发布版本
      await this.projectEnvServerRepository.update(projectEnvServer.id, {
        publishTime,
        publishVersion,
        isFinish: false,
      });
    });

    let shell = `
      echo "Start of build project: ${project.name} ."
      
      # 1. Mkfree Deploy：cd 到项目中对应环境的git路径
      echo "cd ${projectEnvPath}"
      cd ${projectEnvPath};
      
      # 2. Mkfree Deploy：防止代码这里有人修改，先执行 git checkout .
      echo "git checkout ."
      git checkout .
      
      # 3. Mkfree Deploy：git pull 
      echo "git pull"
      git pull
      
      # 4. Mkfree Deploy：git checkout 分支名称
      echo "git checkout ${publishBranch}"
      git checkout ${publishBranch}
      
      # 5. Mkfree Deploy：git pull 分支名称
      echo "git pull origin ${publishBranch}"
      git pull origin ${publishBranch}
      
      # 6. Mkfree Deploy：获取git当前最新版本的版本号
      gitVersion="$(git log -n 1)"
      gitVersion=\$\{gitVersion:27:20\}
      echo "git current version: $gitVersion"
      echo "current version name: ${publishBranchDirName}_$gitVersion"
      
      # 7. Mkfree Deploy：执行构建命令
    `;
    for (const projectBuildStep of buildProjectCommandStepList) {
      shell += `
      echo "${projectBuildStep.step}"
      ${projectBuildStep.step}
      `;
    }
    const projectBuildPath = `${installPathSystemConfig.value}${SystemConfigValues.buildPath}/${project.name}`;
    shell += `
      # 8. Mkfree Deploy：需要上传文件，构建后cp到构建后目录，方便发布
      echo "mkdir -p ${projectBuildPath}/${publishBranchDirName}_$gitVersion"
      mkdir -p ${projectBuildPath}/${publishBranchDirName}_$gitVersion
    `;
    const projectDeployFileList = await this.projectDeployFileRepository.find({ projectId: project.id });
    for (const projectDeployFile of projectDeployFileList) {
      shell += `
      echo "cp -r ${projectEnvPath}/${projectDeployFile.localFilePath} ${projectBuildPath}/${publishBranchDirName}_$gitVersion"
      cp -r ${projectEnvPath}/${projectDeployFile.localFilePath} ${projectBuildPath}/${publishBranchDirName}_$gitVersion
      `;
    }

    shell += `
      # 9. 远程服务器: 创建标准目录结构
      echo "ssh -p ${sshPort} ${sshUsername}@${ip} 'mkdir -p ${project.remotePath}/version'"
      ssh -p ${sshPort} ${sshUsername}@${ip} "mkdir -p ${project.remotePath}/version"
      # 10.  Mkfree Deploy：：上传版本文件
      echo "scp -P ${sshPort} -r ${projectBuildPath}/${publishBranchDirName}_$gitVersion ${sshUsername}@${ip}:${project.remotePath}/version"
      scp -P ${sshPort} -r ${projectBuildPath}/${publishBranchDirName}_$gitVersion ${sshUsername}@${ip}:${project.remotePath}/version
      # 11. 远程服务器：创建当前版本软链接
      echo "ssh -p ${sshPort} ${sshUsername}@${ip} '\n cd ${project.remotePath} \n ln -sf current \n rm -rf current \n ln -s ${project.remotePath}/version/${publishBranchDirName}_$gitVersion current'"
      ssh -p ${sshPort} ${sshUsername}@${ip} "\n cd ${project.remotePath} \n ln -sf current \n rm -rf current \n ln -s ${project.remotePath}/version/${publishBranchDirName}_$gitVersion current"
      # 12 远程服务器：执行构建后命令
    `;
    for (const projectBuildStep of buildAfterProjectCommandStepList) {
      shell += `
      echo "ssh -p ${sshPort} ${sshUsername}@${ip} '${projectBuildStep.step}'"
      ssh -p ${sshPort} ${sshUsername}@${ip} "${projectBuildStep.step}"
      `;
    }

    shell += `
      # 13. 结束项目构建
      echo "End of build project: ${project.name} ."
    `;

    // console.log('shell : ', shell);
    const child = exec(shell);
    child.stdout.on('data', async (data) => {
      // console.log(data);
      await writeStream.write(data);
    });
    child.stderr.on('data', async (data) => {
      // console.log(data);
      await writeStream.write(data);
    });
    child.stdout.on('end', async () => {
      // 修改项目环境当前发布版本
      await this.projectEnvRepository.update(projectEnv.id, { buildSeq: projectEnvBuildSeq, isFinish: true });
      // 修改项目环境日志发布版本
      await this.projectEnvLogRepository.update(projectEnvLog.id, {
        isFinish: true,
      });

      const gitVersionShell = `
        gitVersion="$(git log -n 1)"
        gitVersion=\$\{gitVersion:27:20\}
        echo $gitVersion
      `;
      exec(gitVersionShell, { cwd: projectEnvPath }, async (error, stdoutData, stderrData) => {
        const publishVersion = `${publishBranchDirName}_${stdoutData.replace('\n', '')}`;
        // 修改项目环境服务器当前发布版本
        await this.projectEnvServerRepository.update(projectEnvServer.id, {
          publishVersion: publishVersion,
          lastPublishVersion: publishVersion,
          isFinish: true,
        });
        // 修改项目环境日志发布版本
        await this.projectEnvLogRepository.update(projectEnvLog.id, {
          publishVersion: publishVersion,
        });
      });
    });
    child.stderr.on('end', async () => {
      await this.projectEnvRepository.update(projectEnv.id, { buildSeq: projectEnvBuildSeq, isFinish: true });
      await this.projectEnvLogRepository.update(projectEnvLog.id, {
        isFinish: true,
      });
      const gitVersionShell = `
        gitVersion="$(git log -n 1)"
        gitVersion=\$\{gitVersion:27:20\}
        echo $gitVersion
      `;
      exec(gitVersionShell, { cwd: projectEnvPath }, async (error, stdoutData, stderrData) => {
        const publishVersion = `${publishBranchDirName}_${stdoutData.replace('\n', '')}`;
        // 修改项目环境服务器当前发布版本
        await this.projectEnvServerRepository.update(projectEnvServer.id, {
          publishVersion: publishVersion,
          lastPublishVersion: publishVersion,
          isFinish: true,
        });
        // 修改项目环境日志发布版本
        await this.projectEnvLogRepository.update(projectEnvLog.id, {
          publishVersion: publishVersion,
        });
      });
    });
  }


  /**
   * 项目同步
   * @param dto
   */
  async sync(dto: { projectId: number, publishBranch: string, syncServerId: number, targetServerId, envId: number }) {
    const publishTime = new Date();
    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });

    const targetProjectEnvServer = await this.projectEnvServerRepository.findOne({
      projectId: dto.projectId, envId: dto.envId, serverId: dto.targetServerId,
    });
    if (!targetProjectEnvServer) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnvServer.entityName}, params ${JSON.stringify({
        projectId: dto.projectId, envId: dto.envId, serverId: dto.targetServerId,
      })}, record does not exist.`));
    }

    const targetServer = await this.serverRepository.findOne({ id: targetProjectEnvServer.serverId });
    if (!targetServer) {
      throw new ApiException(ApiResultCode['3'](`${Server.entityName}, params ${JSON.stringify({
        serverId: dto.targetServerId,
      })}, record does not exist.`));
    }

    const project = await this.projectRepository.findOne(targetProjectEnvServer.projectId);
    if (!project) {
      throw new ApiException(ApiResultCode['3'](`${Project.entityName}, params ${JSON.stringify({
        projectId: targetProjectEnvServer.projectId,
      })}, record does not exist.`));

      throw new ApiException(ApiResultCode['3'](`${Project.entityName}, params ${JSON.stringify({
        serverId: dto.targetServerId,
      })}, record does not exist.`));
    }
    if (project.state !== 2) {
      throw new ApiException(ApiResultCode['1001']);
    }
    const projectEnv = await this.projectEnvRepository.findOne({
      projectId: targetProjectEnvServer.projectId,
      envId: targetProjectEnvServer.envId,
    });
    if (!projectEnv) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnv.entityName}, params ${JSON.stringify({
        projectId: targetProjectEnvServer.projectId,
        envId: targetProjectEnvServer.envId,
      })}, record does not exist.`));
    }
    const syncProjectEnvServer = await this.projectEnvServerRepository.findOne({
      envId: dto.envId,
      serverId: dto.syncServerId,
      projectId: project.id,
    });
    const syncServer = await this.serverRepository.findOne({ id: syncProjectEnvServer.serverId });
    if (!syncServer) {
      throw new ApiException(ApiResultCode['3'](`${Server.entityName}, params ${JSON.stringify({ id: syncProjectEnvServer.serverId })}, record does not exist.`));
    }

    const env = await this.envRepository.findOne(projectEnv.envId);
    if (!env) {
      throw new ApiException(ApiResultCode['3'](`${Env.entityName}, params ${JSON.stringify({ id: projectEnv.envId })}, record does not exist.`));
    }

    const projectEnvBuildSeq = projectEnv.buildSeq + 1;

    const projectEnvLog = await this.projectEnvLogRepository.save({
      type: ProjectEnvLogType.sync.code,
      projectId: project.id,
      projectName: project.name,
      envId: env.id,
      projectEnvId: projectEnv.id,
      projectEnvLogSeq: projectEnvBuildSeq,
      publishVersion: syncProjectEnvServer.publishVersion,
      serverId: targetServer.id,
      serverName: targetServer.name,
      serverIp: targetServer.ip,
    } as ProjectEnvLog);

    // 服务器信息
    const targetServerSshUsername = targetServer.sshUsername;
    const targetServerSshPort = targetServer.sshPort;
    const targetServerIp = targetServer.ip;
    let shell = `
          # 1. 同步项目开始
          echo "Start of sync project: ${project.name} ."`;
    shell += `
          # 2. 指定服务器: 创建标准目录结构
          echo "ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} 'mkdir -p ${project.remotePath}/version'"
          ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} "mkdir -p ${project.remotePath}/version"
          # 3.  远程同步服务器：：同步版本文件到指定服务器
          echo "ssh -p ${syncServer.sshPort} ${syncServer.sshUsername}@${syncServer.ip} 'scp  -P ${targetServerSshPort} -r ${project.remotePath}/version/${syncProjectEnvServer.publishVersion} ${targetServerSshUsername}@${targetServerIp}:${project.remotePath}/version'"
          ssh -p ${syncServer.sshPort} ${syncServer.sshUsername}@${syncServer.ip} "scp  -P ${targetServerSshPort} -r ${project.remotePath}/version/${syncProjectEnvServer.publishVersion} ${targetServerSshUsername}@${targetServerIp}:${project.remotePath}/version"
          # 4. 远程服务器：创建当前版本软链接
          echo "ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} '\n cd ${project.remotePath} \n ln -sf current \n rm -rf current \n ln -s ${project.remotePath}/version/${syncProjectEnvServer.publishVersion} current'"
          ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} "\n cd ${project.remotePath} \n ln -sf current \n rm -rf current \n ln -s ${project.remotePath}/version/${syncProjectEnvServer.publishVersion} current"
          # 5. 远程服务器：执行同步后命令
        `;
    const syncProjectCommandStepList = await this.projectCommandStepRepository.find({
      envId: projectEnv.envId,
      projectId: project.id,
      type: ProjectCommandStepType.sync,
    });
    for (const projectBuildStep of syncProjectCommandStepList) {
      shell += `
      echo "ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} '${projectBuildStep.step}'"
      ssh -p ${targetServerSshPort} ${targetServerSshUsername}@${targetServerIp} "${projectBuildStep.step}"
      `;
    }
    shell += `
      # 6. 结束项目构建
      echo "End of sync project: ${project.name} ."
    `;

    const logPath = `${installPathSystemConfig.value}${SystemConfigValues.logPath}/${project.name}`;
    fs.mkdirSync(logPath, { recursive: true });
    const writeStream = fs.createWriteStream(`${logPath}/${ProjectLogFileType.build(env.code, projectEnvBuildSeq)}`);
    const child = exec(shell);
    child.stdout.on('data', async (data) => {
      await writeStream.write(data);
    });
    child.stderr.on('data', async (data) => {
      await writeStream.write(data);
    });
    child.stdout.on('end', async () => {
      await this.projectEnvRepository.update(projectEnv.id, { buildSeq: projectEnvBuildSeq });
      await this.projectEnvServerRepository.update(targetProjectEnvServer.id, {
        publishVersion: syncProjectEnvServer.publishVersion,
        publishTime: publishTime,
        isFinish: true,
      });
      await this.projectEnvLogRepository.update(projectEnvLog.id, { isFinish: true });
    });
    child.stderr.on('end', async () => {
      await this.projectEnvRepository.update(projectEnv.id, { buildSeq: projectEnvBuildSeq });
      await this.projectEnvServerRepository.update(targetProjectEnvServer.id, {
        publishVersion: syncProjectEnvServer.publishVersion,
        publishTime: publishTime,
        isFinish: true,
      });
      await this.projectEnvLogRepository.update(projectEnvLog.id, { isFinish: true });

    });
  }

  /**
   * 改变项目在Eureka的状态
   * @param dto
   * @param pluginEurekaConfig
   */
  async projectAppChangeStatusInEureka(dto: { projectName: string, serverIpList: Array<string>, pluginEurekaApplicationInstanceStatus: string }, pluginEurekaConfig: PluginEurekaConfig) {
    console.log(`项目：${dto.projectName} 在 Eureka 注册中心 ${dto.pluginEurekaApplicationInstanceStatus} 开始`);
    while (true) {
      const app = await this.pluginEurekaService.app({ app: dto.projectName }, pluginEurekaConfig);
      const publishServerEurekaAppInstance = app.application.instance.filter(instance => dto.serverIpList.indexOf(instance.ipAddr) != -1);
      let status = PluginEurekaApplicationInstanceStatus.UP;
      if (dto.pluginEurekaApplicationInstanceStatus === PluginEurekaApplicationInstanceStatus.UP) {
        status = PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE;
      }
      const upPublishServerEurekaAppInstance = publishServerEurekaAppInstance.filter(value => value.status === status);
      // 当需要改变的
      if (upPublishServerEurekaAppInstance.length === 0) {
        break;
      }
      for (const upInstance of upPublishServerEurekaAppInstance) {
        upInstance.status = dto.pluginEurekaApplicationInstanceStatus;
        await this.pluginEurekaService.changeStatus(upInstance, pluginEurekaConfig);
      }
      console.log(`项目：${dto.projectName} 在 Eureka 注册中心 ${dto.pluginEurekaApplicationInstanceStatus} 中`);
      await sleep(45000);
    }
    console.log(`项目：${dto.projectName} 在 Eureka 注册中心 ${dto.pluginEurekaApplicationInstanceStatus} 完成`);
  }

  /**
   * 发布项目
   * @param dto
   */
  async projectBuild(dto: { projectId: number, projectName: string, envId: number, serverId: number, publishBranch: string, serverName?: string }) {
    console.log(`项目：${dto.projectName}  在服务器 ${dto.serverName} 发布开始`);
    let projectIsPublish = false;
    while (true) {
      const projectEnvServer = await this.projectEnvServerRepository.findOne({
        projectId: dto.projectId,
        envId: dto.envId,
        serverId: dto.serverId,
      });

      // 是否允许发布，（未发布 且 发布已经完成 且 （当前版本 或者 最后版本为空 或者 两个版本一致））或者 上一次发布时间已经超过10分钟
      const isAllowPublish = (!projectIsPublish && projectEnvServer.isFinish && (projectEnvServer.publishVersion === null || projectEnvServer.lastPublishVersion === null || projectEnvServer.publishVersion === projectEnvServer.lastPublishVersion))
        || new Date().getTime() - projectEnvServer.publishTime.getTime() > 10 * 60 * 1000;

      if (isAllowPublish) {
        await this.build({
          projectId: dto.projectId,
          publicBranch: dto.publishBranch,
          serverId: dto.serverId,
          envId: dto.envId,
        });
        projectIsPublish = true;
      } else if (projectEnvServer.isFinish) {
        console.log(`项目：${projectEnvServer.projectName} 在服务器 ${dto.serverName} 发布完成`);
        break;
      }
      console.log(`项目：${projectEnvServer.projectName} 在服务器 ${dto.serverName} 发布进行中...`);
      await sleep(30000);
    }
  }

  async projectSync(dto: { projectId: number, envId: number, syncServerId: number, publishBranch: string, targetServerId: number, syncServerName?: string, targetServerName?: string }) {

    let projectIsSync = false;
    while (true) {
      const projectEnvServer = await this.projectEnvServerRepository.findOne({
        projectId: dto.projectId,
        envId: dto.envId,
        serverId: dto.targetServerId,
      });

      console.log(`项目：${projectEnvServer.projectName} 从服务器 ${dto.syncServerName} 同步到 ${dto.targetServerName} 开始`);
      if (!projectIsSync && projectEnvServer.isFinish && (projectEnvServer.publishVersion === null || projectEnvServer.lastPublishVersion === null || projectEnvServer.publishVersion === projectEnvServer.lastPublishVersion)) {
        await this.sync({
          projectId: dto.projectId,
          publishBranch: dto.publishBranch,
          syncServerId: dto.syncServerId,
          targetServerId: dto.targetServerId,
          envId: dto.envId,
        });
        projectIsSync = true;
      } else if (projectEnvServer.isFinish) {
        console.log(`项目：${projectEnvServer.projectName} 从服务器 ${dto.syncServerName} 同步到 ${dto.targetServerName} 完成`);
        break;
      }
      console.log(`项目：${projectEnvServer.projectName} 从服务器 ${dto.syncServerName} 同步 ${dto.targetServerName} 进行中...`);
      await sleep(30000);
    }
  }
}