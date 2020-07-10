import React, { useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Link, history } from 'umi';
import routes from '@/routes';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { PluginEnvSettingDto } from '@/services/dto/PluginEnvSettingDto';
import { SettingOutlined } from '@ant-design/icons/lib';

export default () => {

  const pluginEnvSettingUseRequest = useRequest<ApiResult<PluginEnvSettingDto[]>>(
    routes.apiRoutes.pluginEnvSettingList({ pluginName: 'Eureka' }),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });


  if (!pluginEnvSettingUseRequest.data) {
    return <PageLoading/>;
  }


  if (!pluginEnvSettingUseRequest.data?.result || pluginEnvSettingUseRequest.data?.result.length === 0) {
    return (
      <PageHeaderWrapper>
        没发现Eureka环境配置，去 <Link to={routes.pageRoutes.pluginEurekaEnvSetting}><SettingOutlined/> Eureka环境配置</Link>
      </PageHeaderWrapper>
    );
  }


  let defaultShowList = pluginEnvSettingUseRequest.data.result.filter(value => value.defaultShow);
  if (!defaultShowList || defaultShowList.length === 0) {
    defaultShowList = pluginEnvSettingUseRequest.data.result;
    history.replace(routes.pageRoutes.pluginEurekaEnvIndexParams(defaultShowList[0].envId));
    window.location.reload();
  }

  return '';
}
