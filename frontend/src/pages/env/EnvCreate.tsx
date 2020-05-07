import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EnvForm from '@/pages/env/EnvForm';


export default () => {
  return (
    <PageHeaderWrapper>
      <EnvForm />
    </PageHeaderWrapper>
  );
};
