import { get, RequestOptions } from '@/utils/request';
import routes from '@/routes';

export async function list(requestOptions: RequestOptions) {
  requestOptions.url = `${routes.apiRoutes.projectEnvList}?projectId=${requestOptions.payload.projectId}`;
  return get(requestOptions);
}
