import React  from 'react';
import { useRequest } from 'ahooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import routes from '@/routes';
import {  USER_KEY, UserDto } from '@/services/dto/UserDto';
import { ApiResult } from '@/services/ApiResult';
import UserForm from '@/pages/user/UserForm';


export default () => {

  const params = useParams() as { id: string };
  const { data } = useRequest<ApiResult<UserDto>>(() => ({
    url: `${routes.apiRoutes.userInfo}?id=${params?.id}`,
    method: 'get',
    headers: {
      access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
    },
  }), { manual: false });

  return (
    <PageHeaderWrapper>
      <UserForm user={data?.result} edit={true}/>
    </PageHeaderWrapper>
  );
};
