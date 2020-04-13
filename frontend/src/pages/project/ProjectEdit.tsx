import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectProps, connect, ProjectModelState } from 'umi';
import ProjectForm from '@/pages/project/components/ProjectFrom';

/**
 * 页面属性
 */
export interface ProjectEditPageProps extends ConnectProps {
  project?: ProjectModelState;
}


const ProjectEditPage: React.FC<ProjectEditPageProps> = ({ project, dispatch }) => {
  return <PageHeaderWrapper title={`项目名称：${project?.project?.name}`}>
    <ProjectForm project={project} dispatch={dispatch}/>
  </PageHeaderWrapper>;
};

export default connect(
  ({ project }: ProjectEditPageProps) => ({ project }),
)(ProjectEditPage);
