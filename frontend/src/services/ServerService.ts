import { get } from '@/utils/MKRequest';
import routes from '@/routes';

export async function list() {
  return get({ url: `${routes.apiRoutes.serverList.url}` });
}
