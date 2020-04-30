import Request from '@/utils/Request';
import { RequestOptionsInit } from 'umi-request';


export interface EurekaRequestOptions {
  url: string;
  headers: undefined;
}

/**
 * Eureka项目列表
 * @param options
 */
export async function list(options: EurekaRequestOptions) {
  const optionsInit = {
    headers: options.headers,
  } as RequestOptionsInit;
  return Request.get(options.url, optionsInit);
}
