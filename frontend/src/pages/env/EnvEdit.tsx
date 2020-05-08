import React, { useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import routes from '@/routes';
import { ApiResult } from '@/services/ApiResult';
import EnvForm from '@/pages/env/EnvForm';
import { ServerDto } from '@/services/dto/ServerDto';
import {  USER_KEY } from '@/services/dto/UserDto';
import { EnvDto } from '@/services/dto/EnvDto';


export default () => {

  const params = useParams() as { id: string };
  const { data } = useRequest<ApiResult<EnvDto>>(() => ({
    url: `${routes.apiRoutes.envInfo.url}?id=${params?.id}`,
    method: routes.apiRoutes.envInfo.method,
    headers: {
      access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
    },
  }), { manual: false });

  return (
    <PageHeaderWrapper>
      <EnvForm info={data?.result} edit={true}/>
    </PageHeaderWrapper>
  );
};
