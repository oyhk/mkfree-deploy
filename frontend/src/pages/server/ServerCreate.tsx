import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ServerForm from '@/pages/server/ServerForm';


export default () => {
  return (
    <PageHeaderWrapper>
      <ServerForm />
    </PageHeaderWrapper>
  );
};
