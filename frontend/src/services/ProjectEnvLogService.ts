import { get, RequestOptions } from '@/utils/request';
import routes from '@/routes';

export async function list(requestOptions: RequestOptions) {
  requestOptions.url = `${routes.apiRoutes.projectEnvLogList}?projectId=${requestOptions.dto.projectId}&envId=${requestOptions.dto.envId}`;
  return get(requestOptions);
}

export async function info(requestOptions: RequestOptions) {
  requestOptions.url = `${routes.apiRoutes.projectEnvLogInfo}?projectId=${requestOptions.dto.projectId}&envId=${requestOptions.dto.envId}&projectEnvLogSeq=${requestOptions.dto.projectEnvLogSeq}`;
  return get(requestOptions);
}
