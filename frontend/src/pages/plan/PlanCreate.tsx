import React from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import PlanForm from '@/pages/plan/PlanForm';
import { PlanDto } from '@/services/dto/PlanDto';


export default () => {

  const plan = { planEnvList: [], planScriptList: [] } as PlanDto;
  return (
    <PageHeaderWrapper
      title={`版本计划创建`}
    >
      <PlanForm plan={plan}/>
    </PageHeaderWrapper>
  );
};
