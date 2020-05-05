import React  from 'react';
import { useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import routes from '@/routes';
import { ACCESS_TOKEN_KEY, UserDto } from '@/services/dto/UserDto';
import { ApiResult } from '@/services/ApiResult';
import UserForm from '@/pages/user/UserForm';


export default () => {

  const params = useParams() as { id: string };
  const { data } = useRequest<ApiResult<UserDto>>(() => ({
    url: `${routes.apiRoutes.userInfo}?id=${params?.id}`,
    method: 'get',
    headers: {
      access_token: localStorage.getItem(ACCESS_TOKEN_KEY),
    },
  }), { manual: false });

  return (
    <PageHeaderWrapper>
      <UserForm user={data?.result} edit={true}/>
    </PageHeaderWrapper>
  );
};
