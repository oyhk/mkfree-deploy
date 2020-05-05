import React, { useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useParams } from 'umi';
import routes from '@/routes';
import { UserAddOutlined } from '@ant-design/icons';
import { UserDto } from '@/services/dto/UserDto';
import { Button, Form, Input, notification, Select } from 'antd';
import { ApiResult } from '@/services/ApiResult';
import UserForm from '@/pages/user/UserForm';


export default () => {

  const params = useParams() as { id: string };
  const { data } = useRequest<ApiResult<UserDto>>(() => ({
    url: `${routes.apiRoutes.userInfo}?id=${params?.id}`,
    method: 'get',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  }), { manual: false });

  return (
    <PageHeaderWrapper>
      <UserForm user={data?.result} edit={true}/>
    </PageHeaderWrapper>
  );
};
