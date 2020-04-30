import { get, RequestOptions } from '@/utils/MKRequest';
import routes from '@/routes';

export async function list(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvList}?projectId=${options.payload.projectId}`;
  return get(options);
}


export async function info(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvInfo}?projectId=${options.payload.projectId}&envId=${options.payload.envId}`;
  return get(options);
}
