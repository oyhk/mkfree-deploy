import React, { useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Link, history } from 'umi';
import routes from '@/routes';
import { UserAddOutlined } from '@ant-design/icons';
import { UserDto } from '@/services/dto/UserDto';
import { Button, Form, Input, notification, Select } from 'antd';
import { ApiResult } from '@/services/ApiResult';
import UserForm from '@/pages/user/UserForm';


export default () => {


  return (
    <PageHeaderWrapper>
      <UserForm />
    </PageHeaderWrapper>
  );
};