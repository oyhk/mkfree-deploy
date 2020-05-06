import Request from '@/utils/Request';
import { RequestOptionsInit } from 'umi-request';


export interface EurekaRequestOptions {
  url: string;
  headers: undefined;
}

/**
 * Eureka 项目列表
 * @param options
 */
export async function list(options: EurekaRequestOptions) {
  const optionsInit = {
    headers: options.headers,
  } as RequestOptionsInit;
  return Request.get(options.url, optionsInit);
}

/**
 * Eureka 状态变更
 * @param options
 */
export async function statusChange(options: EurekaRequestOptions) {
  const optionsInit = {
    headers: options.headers,
  } as RequestOptionsInit;
  return Request.put(options.url, optionsInit);
}
