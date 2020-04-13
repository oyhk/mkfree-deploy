import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ProjectForm from '@/pages/project/components/ProjectFrom';
import { ProjectPageProps } from '@/pages/project/ProjectPageProps';


const ProjectEditPage: React.FC<ProjectPageProps> = ({ project, dispatch }) => {
  return <PageHeaderWrapper title={`项目名称：${project?.project?.name}`}>
    <ProjectForm project={project} dispatch={dispatch}/>
  </PageHeaderWrapper>;
};

export default connect(
  ({ project }: ProjectPageProps) => ({ project }),
)(ProjectEditPage);
