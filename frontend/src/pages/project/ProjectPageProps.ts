import { ConnectProps, ProjectModelState } from 'umi';

/**
 * 页面属性
 */
export interface ProjectPageProps extends ConnectProps {
  project?: ProjectModelState;

  isCreate?: boolean;
}
