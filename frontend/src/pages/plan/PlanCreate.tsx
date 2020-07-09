import React from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import PlanForm from '@/pages/plan/PlanForm';



export default () => {

  return (
    <PageHeaderWrapper
      title={`版本计划创建`}
    >
      <PlanForm/>
    </PageHeaderWrapper>
  );
};
