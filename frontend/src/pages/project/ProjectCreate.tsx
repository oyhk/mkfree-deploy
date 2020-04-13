import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ProjectForm from '@/pages/project/components/ProjectFrom';
import { Dispatch, ProjectModelState } from '@@/plugin-dva/connect';

/**
 * 页面属性
 */
export interface ProjectCreatePageProps {
  project?: ProjectModelState;
  dispatch?: Dispatch;
}

const ProjectCreatePage: React.FC<ProjectCreatePageProps> = ({ project, dispatch }) => {
  return (
    <PageHeaderWrapper>
      <ProjectForm project={project} dispatch={dispatch} />
    </PageHeaderWrapper>
  );
};

export default connect(({ project }: ProjectCreatePageProps) => ({ project }))(ProjectCreatePage);
