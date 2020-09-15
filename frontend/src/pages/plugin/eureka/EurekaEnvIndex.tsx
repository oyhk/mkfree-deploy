import {
  PluginEurekaApplication,
  PluginEurekaApplicationInstance,
  PluginEurekaApplicationInstanceStatus,
} from '@/services/plugin/PluginEurekaDto';
import { Button, notification, Table, Select } from 'antd';
import { Link, useParams } from 'umi';
import routes from '@/routes';
import { SettingOutlined } from '@ant-design/icons/lib';
import ProTable from '@ant-design/pro-table/lib/Table';
import React from 'react';
import { useRequest } from 'ahooks';
import { Base64 } from 'js-base64';
import { PageLoading } from '@ant-design/pro-layout';
import { ApiResult } from '@/services/ApiResult';
import { EnvDto } from '@/services/dto/EnvDto';
import { history } from '@@/core/history';

export default () => {

  const envId = useParams<{ id: string }>().id;

  const envListUseRequest = useRequest<ApiResult<EnvDto[]>>(
    routes.apiRoutes.envList()
    ,
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  const eurekaListUseRequest = useRequest(
    routes.apiRoutes.pluginEurekaList({envId}),
    {
      pollingInterval: 3000,
      manual: false,
      refreshOnWindowFocus: false,
    });

  const eurekaStatusChangeUseRequest = useRequest((instance) => routes.apiRoutes.pluginEurekaStatus(instance),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `修改项目状态，操作成功`,
            description: 'Eureka 项目状态稍有延迟，系统将自动刷新状态，请稍等。',
          });
        }
        return ar;
      },
      fetchKey: instance => instance.instanceId,
      manual: true,
      refreshOnWindowFocus: false,
    });

  if (!eurekaListUseRequest.data) {
    return <PageLoading/>;
  }


  return (
    <ProTable
      rowKey='name'
      search={false}
      dataSource={eurekaListUseRequest.data?.result.applications?.application as PluginEurekaApplication[]}
      columns={[
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
        },
      ]}
      expandable={{
        expandedRowRender: (record: any) => {
          return <Table
            dataSource={(record.instance as PluginEurekaApplicationInstance[])?.sort((one, two) => (one.instanceId < two.instanceId ? -1 : 1))}
            rowKey={'instanceId'}
            columns={[
              {
                title: '实例ID',
                dataIndex: 'instanceId',
                key: 'instanceId',
              },
              {
                title: 'IP地址',
                dataIndex: 'ipAddr',
                key: 'ipAddr',
              },
              {
                title: 'metadata',
                dataIndex: 'metadata',
                key: 'metadata',
                render: (metadata: any) => {
                  return <div>{JSON.stringify(metadata)}</div>;
                },
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
              },
              {
                title: '操作',
                dataIndex: '',
                key: '',
                render: (instance) => {
                  return instance.status === 'UP' ?
                    <Button
                      danger={true}
                      type='dashed'
                      loading={eurekaStatusChangeUseRequest.fetches[instance.instanceId]?.loading}
                      onClick={() => {
                        eurekaStatusChangeUseRequest.run({
                          ...instance,
                          status: PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE,
                          envId:envId
                        });
                      }}
                    >下线</Button> :
                    <Button
                      type='primary'
                      loading={eurekaStatusChangeUseRequest.fetches[instance.instanceId]?.loading}
                      onClick={() => {
                        eurekaStatusChangeUseRequest.run({
                          ...instance,
                          status: PluginEurekaApplicationInstanceStatus.UP,
                          envId:envId
                        });
                      }}
                    >上线</Button>;
                },
              },
            ]}
            pagination={false}
            footer={() => <div/>}
          />;
        },
        defaultExpandAllRows: true,
      }}
      headerTitle={
        <div>
          {
            envListUseRequest.data ?
              <Select
                style={{ width: 150 }}
                defaultValue={envId}
                onSelect={(value) => {
                  history.push(routes.pageRoutes.pluginEurekaEnvIndexParams(value));
                  window.location.reload();
                }}
              >
                {
                  envListUseRequest.data?.result?.map(env => <Select.Option key={env.id}
                                                                            value={env.id + ''}>{env.name}</Select.Option>)
                }
              </Select> :
              <PageLoading/>
          }
        </div>
      }
      toolBarRender={() => [
        <Link to={routes.pageRoutes.pluginEurekaEnvSetting}><SettingOutlined/> Eureka环境配置</Link>,
      ]}
      pagination={false}
    />
  );
}
