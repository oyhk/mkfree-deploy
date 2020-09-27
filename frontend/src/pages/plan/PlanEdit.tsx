import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import PlanForm from '@/pages/plan/PlanForm';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { PlanDto } from '@/services/dto/PlanDto';
import routes from '@/routes';
import { useParams } from 'umi';


export default () => {
  const params = useParams() as { id?: number };
  const planInfoUseRequest = useRequest<ApiResult<PlanDto>>(
    () => routes.apiRoutes.planInfo(params),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  if (!planInfoUseRequest?.data?.result) {
    return <PageLoading/>;
  }
  return (
    <PageHeaderWrapper title={`版本计划编辑`}>
      <PlanForm plan={planInfoUseRequest?.data?.result}/>
    </PageHeaderWrapper>
  );
};
