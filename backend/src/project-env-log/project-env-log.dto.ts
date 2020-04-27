import { ProjectCommandStep } from '../project-build-step/project-command-step.entity';
import { ProjectEnvServerDto } from '../project-env-server/project-env-server.dto';
import { ProjectEnvLog } from './project-env-log.entity';

/**
 * 项目环境日志
 */
export class ProjectEnvLogDto extends ProjectEnvLog {
  // 日志内容
  text:string;

  typeDesc:string;
}
