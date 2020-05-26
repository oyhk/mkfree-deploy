import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import PlanForm from '@/pages/plan/PlanForm';



export default () => {
  return (
    <PageHeaderWrapper
      title={`版本计划编辑`}
    >
      <PlanForm/>
    </PageHeaderWrapper>
  );
};
