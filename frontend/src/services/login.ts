import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
}

export async function userLogin(params: LoginParamsType) {
  return request('http://localhost:9998/api/user/login', {
    method: 'POST',
    data: params,
  });
}
