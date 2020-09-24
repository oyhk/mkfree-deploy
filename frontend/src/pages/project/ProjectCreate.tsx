import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProjectForm from '@/pages/project/ProjectFrom';
import { ProjectDto } from '@/services/dto/ProjectDto';

export default () => {

  const project = {} as ProjectDto;

  return (
    <PageHeaderWrapper title='项目创建'>
      <ProjectForm project={project} />
    </PageHeaderWrapper>
  );
}
