import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import PlanForm from '@/pages/plan/PlanForm';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { PlanDto } from '@/services/dto/PlanDto';
import routes from '@/routes';
import { useParams } from 'umi';



export default () => {

  const params = useParams() as { id?: number };
  const [plan, setPlan] = useState<PlanDto>();


  console.log(params);

  useRequest<ApiResult<PlanDto>>(
    () => routes.apiRoutes.planInfo(params),
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          console.log('plan edit page, plan info', apiResult.result);
          setPlan(apiResult.result);
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  if(!plan){
    return <PageLoading/>
  }


  return (
    <PageHeaderWrapper
      title={`版本计划编辑`}
    >
      <PlanForm plan={plan}/>
    </PageHeaderWrapper>
  );
};
