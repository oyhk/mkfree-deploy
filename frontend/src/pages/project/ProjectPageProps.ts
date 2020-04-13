import { ConnectProps, ProjectModelState } from '@@/plugin-dva/connect';

/**
 * 页面属性
 */
export interface ProjectPageProps extends ConnectProps {
  project?: ProjectModelState;
}
