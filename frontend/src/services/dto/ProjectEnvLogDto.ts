import { BaseDto } from '@/services/dto/BaseDto';
import { ProjectBuildStepDto } from '@/services/dto/ProjectBuildStepDto';
import { ProjectEnvServerDto } from '@/services/dto/ProjectEnvServerDto';

/**
 * 项目环境日志
 */
export interface ProjectEnvLogDto extends BaseDto {
  // 日志类型，1.项目构建 2.项目同步
  type: number;
  // 日志类型描述
  typeDesc:string;
  // 项目id
  projectId: number;
  // 项目名称
  projectName: string;
  // 环境id
  envId: number;
  // 项目环境id
  projectEnvId: number;
  // 项目环境日志序号
  projectEnvLogSeq: number;
  // 日志内容
  text: string;
  // 日志时间
  createdAt:string;
  // 日志是否输出完成，默认：否'
  isFinish:boolean;
}
