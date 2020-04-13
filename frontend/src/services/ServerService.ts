import { get } from '@/utils/request';
import routes from '@/routes';

export async function list() {
  return get(`${routes.apiRoutes.serverList}`);
}
