import React, { useEffect } from 'react';
import { UseAPIProvider } from '@umijs/use-request';
import Request from '@/utils/Request1';
import routes from '@/routes';
import { ApiResult } from '@/services/ApiResult';
import { notification } from 'antd';

export default (props: any) => {

  useEffect(() => {
    const installed = localStorage.getItem('installed');
    if (!installed && props?.location?.pathname !== routes.pageRoutes.installIndex) {
      Request.get(routes.apiRoutes.systemInstalled.url).then(value => {
        if (value.result !== 'SUCCESS') {
          props.history.replace(routes.pageRoutes.installIndex);
        }
      });
    }
  });

  return (
    <UseAPIProvider value={{
      refreshOnWindowFocus: true,
      requestMethod: (options) => Request(options.url, options).then((res) => {
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
      })
    }}>
      {props.children}
    </UseAPIProvider>
  );
};
