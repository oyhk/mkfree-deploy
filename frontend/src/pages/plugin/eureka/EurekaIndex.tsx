import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import routes from '@/routes';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { PluginEnvSettingDto } from '@/services/dto/PluginEnvSettingDto';
import { notification } from 'antd';

export default (props: any) => {

  useRequest<ApiResult<PluginEnvSettingDto[]>>(
    routes.apiRoutes.pluginEnvSettingList({ pluginName: 'Eureka' }),
    {
      onSuccess: (ar) => {

        if (!ar.result || ar.result.length === 0) {
          props.history.replace(routes.pageRoutes.pluginEurekaEnvSetting);
          return;
        }
        // 默认展示Eureka环境列表，当如果没有设置默认展示，则跳转到Eureka环境配置页面
        let defaultShowList = ar.result.filter(value => value.defaultShow);
        if (!defaultShowList || defaultShowList.length === 0) {
          props.history.replace(routes.pageRoutes.pluginEurekaEnvSetting);
          notification.warn({
            message: `Eureka默认配置不存在`,
            description: '请先设置Eureka环境配置',
          });
          return;
        }
        props.history.replace(routes.pageRoutes.pluginEurekaEnvIndexParams(defaultShowList[0].envId));
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  return <PageLoading/>;
}
