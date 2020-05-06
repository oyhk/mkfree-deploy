import Request from '@/utils/Request';
import { RequestOptionsInit } from 'umi-request';


export interface RequestOptions {
  url: string;
  method: string;
  headers: undefined;
}

/**
 * Eureka 项目列表
 * @param options
 */
export async function install(options: RequestOptions) {

  const optionsInit = {
    headers: options.headers,
  } as RequestOptionsInit;
  return Request.post(options.url, optionsInit);
}
