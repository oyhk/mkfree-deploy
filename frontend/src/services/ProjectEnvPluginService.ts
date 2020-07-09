import { get, RequestOptions } from '@/utils/MKRequest';
import routes from '@/routes';
import { ProjectEnvPluginDto } from '@/services/dto/ProjectEnvPluginDto';


export async function info(options: RequestOptions) {
  options.url = `${routes.apiRoutes.projectEnvPluginInfo().url}?projectId=${options.payload.projectId}&envId=${options.payload.envId}`;
  return get(options);
}
