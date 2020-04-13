import { BaseDto } from '@/models/global';

/**
 * 项目构建步骤
 */
export interface ProjectBuildStepDto extends BaseDto {
  projectEnvId?: number;
  projectId?: number;
  projectName?: string;
  step?: string;
  type?: number;
}
