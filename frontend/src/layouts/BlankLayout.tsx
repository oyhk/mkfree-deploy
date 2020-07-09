import React, { useEffect } from 'react';
import { UseRequestProvider } from 'ahooks';
import Request from '@/utils/Request1';
import routes from '@/routes';
import { ApiResult } from '@/services/ApiResult';
import { notification } from 'antd';
import { USER_KEY } from '@/services/dto/UserDto';

export default (props: any) => {

  useEffect(() => {
    const installed = localStorage.getItem('installed');
    if (!installed && props?.location?.pathname !== routes.pageRoutes.installIndex) {
      Request.get(routes.apiRoutes.systemInstalled.url).then(value => {
        if (value.result !== 'SUCCESS') {
          props.history.replace(routes.pageRoutes.installIndex);
        }
        localStorage.setItem('installed', value.result);
      });
    }
  });

  return (
    <UseRequestProvider value={{
      refreshOnWindowFocus: true,
      requestMethod: (options = {}) => {

        // 自定义请求
        if (options?.custom) {
          options.headers = {
            ...options.headers,
          };
          return Request(options.url, options).then((res) => {
            return res;
          });
        }
        // 通用请求处理
        else {
          options.headers = {
            access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
            ...options.headers,
          };
          return Request(options.url, options).then((res) => {
            if (res instanceof Response) {
              return undefined;
            }

            const apiResult = res as ApiResult<any>;

            if (apiResult.code === 1) {
              return apiResult;
            }
            if (apiResult.code === 103 || apiResult.code === 104) {
              props.history.replace(routes.pageRoutes.userLogin);
              return undefined;
            }
            notification.error({
              message: `请求错误 ${apiResult.code}: ${options.url}`,
              description: apiResult.desc,
            });
            return undefined;
          });
        }
      },
    }}>
      {props.children}
    </UseRequestProvider>
  );
};
