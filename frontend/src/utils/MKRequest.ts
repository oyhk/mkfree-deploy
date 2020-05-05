/**
 * MKRequest 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import { ApiResult } from '@/services/ApiResult';
import { history } from 'umi';
import routes from '@/routes';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    // @ts-ignore
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const MKRequest = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

const requestThen = (options: RequestOptions, apiResult: ApiResult<any>) => {
  if (apiResult?.code === 1) {
    if (options.successCallback) {
      options.successCallback();
    }
    if (options.isAll)
      return apiResult;
    else
      return apiResult.result;
  } else if (apiResult?.code) {
    if (options.failCallback) {
      options.failCallback();
    }
    notification.error({
      message: `请求错误 ${apiResult.code}: ${options.url}`,
      description: apiResult.desc,
    });
    if (apiResult.code === 103 || apiResult.code === 104) {
      history.replace(routes.pageRoutes.userLogin);
    }
    return apiResult;
  }
  return undefined;
};

export interface RequestOptions {
  url?: string;
  payload?: any;
  isAll?: boolean;// 是否返回api整个对象，默认false
  successCallback?: Function;
  failCallback?: Function;
  headers?: {},
}

export const get = (options: RequestOptions) => {
  const optionsInit = {
    data: options.payload,
    headers: { ...options.headers, 'access_token': localStorage.getItem('access_token') },
  } as RequestOptionsInit;
  return MKRequest.get(`${options.url}`, optionsInit).then((apiResult: ApiResult<any>) => requestThen(options, apiResult));
};

export const post = (options: RequestOptions) => {
  const optionsInit = {
    data: options.payload,
    headers: { ...options.headers, 'access_token': localStorage.getItem('access_token') },
  } as RequestOptionsInit;

  return MKRequest.post(`${options.url}`, optionsInit).then((apiResult: ApiResult<any>) => requestThen(options, apiResult));
};

export const put = (options: RequestOptions) => {
  const optionsInit = {
    data: options.payload,
    headers: { ...options.headers, 'access_token': localStorage.getItem('access_token') },
  } as RequestOptionsInit;
  return MKRequest.put(`${options.url}`, optionsInit).then((apiResult: ApiResult<any>) => requestThen(options, apiResult));
};


export default MKRequest;
