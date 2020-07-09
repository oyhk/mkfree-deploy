import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UserForm from '@/pages/user/UserForm';


export default () => {


  return (
    <PageHeaderWrapper>
      <UserForm />
    </PageHeaderWrapper>
  );
};
