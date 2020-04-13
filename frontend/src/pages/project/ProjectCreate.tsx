import React from 'react';
import { ProjectPageProps } from '@/pages/project/ProjectIndex';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ProjectForm from '@/pages/project/components/ProjectFrom';
import { ConnectProps, Dispatch, ProjectModelState } from '@@/plugin-dva/connect';

/**
 * 页面属性
 */
export interface ProjectEditPageProps {
  project?: ProjectModelState;
  dispatch?: Dispatch;
}


const ProjectEditPage: React.FC<ProjectEditPageProps> = ({ project, dispatch }) => {
  return <PageHeaderWrapper title={`项目名称：${project?.project?.name}`}>
    <ProjectForm project={project} dispatch={dispatch}/>
  </PageHeaderWrapper>;
};

export default connect(
  ({ project, dispatch }: ProjectPageProps) => ({ project }),
)(ProjectEditPage);
