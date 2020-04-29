import { get, RequestOptions } from '@/utils/request';
import routes from '@/routes';

export async function list(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvLogList}?projectId=${options.payload.projectId}&envId=${options.payload.envId}`;
  return get(options);
}

export async function info(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvLogInfo}?projectId=${options.payload.projectId}&envId=${options.payload.envId}&projectEnvLogSeq=${options.payload.projectEnvLogSeq}`;
  return get(options);
}
