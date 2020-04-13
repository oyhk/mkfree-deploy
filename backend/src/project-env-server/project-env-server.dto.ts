import { ProjectEnvServer } from './project-env-server.entity';

/**
 * 项目环境服务器
 */
export class ProjectEnvServerDto extends ProjectEnvServer {
  // 是否选中的服务器ip
  isSelectServerIp: boolean;
}
