import { BaseDto } from '@/models/dto/BaseDto';

/**
 * 项目部署文件
 */
export interface ProjectDeployFileDto extends BaseDto {
  projectId?: number;
  projectName?: string;
  isEnable?: boolean;
  localFilePath?: string;
  remoteFilePath?: string;
}
