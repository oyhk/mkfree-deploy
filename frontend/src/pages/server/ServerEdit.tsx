import React, { useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import routes from '@/routes';
import { ApiResult } from '@/services/ApiResult';
import ServerForm from './ServerForm';
import { ServerDto } from '@/services/dto/ServerDto';
import {  USER_KEY } from '@/services/dto/UserDto';


export default () => {

  const params = useParams() as { id: string };
  const { data } = useRequest<ApiResult<ServerDto>>(() => ({
    url: `${routes.apiRoutes.serverInfo.url}?id=${params?.id}`,
    method: routes.apiRoutes.serverInfo.method,
    headers: {
      access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
    },
  }), { manual: false });

  return (
    <PageHeaderWrapper>
      <ServerForm info={data?.result} edit={true}/>
    </PageHeaderWrapper>
  );
};
