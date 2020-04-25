import request, { post, RequestOptions } from '@/utils/request';
import routes from '@/routes';

export async function login(requestOptions: RequestOptions) {
  requestOptions.url = routes.apiRoutes.userLogin;
  return post(requestOptions);
}
