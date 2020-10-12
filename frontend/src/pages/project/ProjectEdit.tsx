import React from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import ProjectForm from '@/pages/project/ProjectFrom';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { ProjectDto } from '@/services/dto/ProjectDto';
import routes from '@/routes';


export default () => {

  const params = useParams() as { id?: number };
  const projectInfoUseRequest = useRequest<ApiResult<ProjectDto>>(
    () => routes.apiRoutes.projectInfo({id:params.id}),
    {
      manual: false,
      refreshOnWindowFocus: false,
    },
  );
  if(!projectInfoUseRequest?.data?.result){
    return <PageLoading/>;
  }

  return (
    <PageHeaderWrapper title={`项目名称：${projectInfoUseRequest.data?.result?.name}`}>
      <ProjectForm project={projectInfoUseRequest?.data?.result}/>
    </PageHeaderWrapper>
  );
}
