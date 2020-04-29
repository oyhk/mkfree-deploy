import { get, RequestOptions } from '@/utils/request';
import routes from '@/routes';

export async function list(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvList}?projectId=${options.payload.projectId}`;
  return get(options);
}
