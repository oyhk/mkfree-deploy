import MKRequest, { post, RequestOptions } from '@/utils/MKRequest';
import routes from '@/routes';

export async function login(requestOptions: RequestOptions) {
  requestOptions.url = routes.apiRoutes.userLogin;
  return post(requestOptions);
}
