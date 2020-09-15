import { SystemConfig, SystemConfigKeys, SystemConfigValues } from '../system-config/system-config.entity';
import { ProjectEnvServer } from '../project-env-server/project-env-server.entity';
import { Server } from '../server/server.entity';
import { Project, ProjectLogFileType } from './project.entity';
import { ApiResult, ApiResultCode } from '../common/api-result';
import { ProjectEnv } from '../project-env/project-env.entity';
import { Env } from '../env/env.entity';
import { ProjectEnvLog, ProjectEnvLogType } from '../project-env-log/project-env-log.entity';
import { ProjectCommandStep, ProjectCommandStepType } from '../project-build-step/project-command-step.entity';
import * as fs from 'fs';
import { exec } from 'child_process';
import { ProjectDto } from './project.dto';
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
    private jwtService: JwtService,
  ) {
  }


  async build(dto: { projectId: number, publicBranch: string, serverId: number, envId: number }) {
    const publishTime = new Date();
    let publishBranch = dto.publicBranch;

    const installPathSystemConfig = await this.systemConfigRepository.findOne({ key: SystemConfigKeys.installPath });

    const projectEnvServer = await this.projectEnvServerRepository.findOne(dto.serverId);
    if (!projectEnvServer) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnvServer.entityName} params:${dto.serverId}, record does not exist.`));
    }

    const server = await this.serverRepository.findOne({ id: dto.serverId });
    if (!server) {
      throw new ApiException(ApiResultCode['3'](`${Server.entityName} params:${dto.serverId}, record does not exist.`));
    }

    const project = await this.projectRepository.findOne(dto.projectId);
    if (!project) {
      throw new ApiException(ApiResultCode['3'](`${Project.entityName} params:${dto.projectId}, record does not exist.`));
    }
    if (project.state !== 2) {
      throw new ApiException(ApiResultCode['1001']);
    }


    const projectEnv = await this.projectEnvRepository.findOne({
      projectId: dto.projectId,
      envId: dto.envId,
    });

    if (!projectEnv) {
      throw new ApiException(ApiResultCode['3'](`${ProjectEnv.entityName} params:${dto.envId}, record does not exist.`));
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
      isFinish: true,
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


    // 更新 projectEnvServer
    const gitVersionShell = `
        gitVersion="$(git log -n 1)"
        gitVersion=\$\{gitVersion:27:20\}
        echo $gitVersion
      `;
    exec(gitVersionShell, { cwd: projectEnvPath }, async (error, stdoutData, stderrData) => {
      const publishVersion = `${publishBranchDirName}_${stdoutData.replace('\n', '')}`;
      // 修改项目环境当前发布版本
      await this.projectEnvRepository.update(projectEnv.id, { publishVersion });
      // 修改项目环境服务器当前发布版本
      await this.projectEnvServerRepository.update(projectEnvServer.id, { publishVersion });
      // 修改项目环境日志发布版本
      await this.projectEnvLogRepository.update(projectEnvLog.id, { publishVersion });
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

    console.log('shell : ', shell);
    const child = exec(shell);
    child.stdout.on('data', async (data) => {
      console.log(data);
      await writeStream.write(data);
    });
    child.stderr.on('data', async (data) => {
      console.log(data);
      await writeStream.write(data);
    });
    child.stdout.on('end', async () => {
      // 修改项目环境当前发布版本
      await this.projectEnvRepository.update(projectEnv.id, { isFinish: true });
      // 修改项目环境日志发布版本
      await this.projectEnvLogRepository.update(projectEnvLog.id, { isFinish: true });
    });
    child.stderr.on('end', async () => {
      await this.projectEnvRepository.update(projectEnv.id, { isFinish: true });
      await this.projectEnvLogRepository.update(projectEnvLog.id, { isFinish: true });
    });
  }
}