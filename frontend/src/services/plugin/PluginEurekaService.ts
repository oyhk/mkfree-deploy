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
  try {
    return Request.get(options.url, optionsInit);
  }catch (e) {
    console.log(e);
  }
}

/**
 * Eureka 状态变更
 * @param options
 */
export async function statusChange(options: EurekaRequestOptions) {
  const optionsInit = {
    headers: options.headers,
  } as RequestOptionsInit;
  try {
    return Request.put(options.url, optionsInit);
  }catch (e) {
    console.log(e);
  }
}
