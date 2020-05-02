import React from 'react';
import { Modal, Table, Button } from 'antd';
import { connect, useDispatch } from 'umi';
import { PluginEurekaModelState } from '@/pages/project/models/PluginEurekaModel';
import { Dispatch } from '@@/plugin-dva/connect';
import { uuid } from '@/utils/utils';
import {
  PluginEurekaApplicationInstance,
  PluginEurekaApplicationInstanceStatus,
} from '@/services/plugin/PluginEurekaDto';
import { PageLoading } from '@ant-design/pro-layout';

interface PluginEurekaPageProps {
  pluginEureka?: PluginEurekaModelState;
  dispatch?: Dispatch;
}

const PluginEurekaIndex: React.FC<PluginEurekaPageProps> = props => {
  const dispatch = useDispatch();


  // eslint-disable-next-line no-unused-expressions
  props?.pluginEureka?.eureka?.application.instance.forEach(value => {
    value.operation = value;
  });

  const dataSource = props.pluginEureka?.eureka?.application.instance;

  const columns = [
    {
      title: '实例Id',
      dataIndex: 'instanceId',
      key: 'instanceId',
    },
    {
      title: 'ip地址',
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
      dataIndex: 'operation',
      key: 'operation',
      render: (pluginEurekaApplicationInstance: PluginEurekaApplicationInstance) => {
        return pluginEurekaApplicationInstance.status === 'UP' ?
          <Button danger={true} type='dashed' onClick={() => {
            dispatch({
              type: 'pluginEureka/statusChange',
              payload: {
                status: PluginEurekaApplicationInstanceStatus.OUT_OF_SERVICE,
                app: pluginEurekaApplicationInstance.app,
                instanceId: pluginEurekaApplicationInstance.instanceId,
              },
            });
          }}>下线</Button> :
          <Button type='primary' onClick={() => {
            dispatch({
              type: 'pluginEureka/statusChange',
              payload: {
                status: PluginEurekaApplicationInstanceStatus.UP,
                app: pluginEurekaApplicationInstance.app,
                instanceId: pluginEurekaApplicationInstance.instanceId,
              },
            });
          }}
          >上线</Button>;
      },
    },

  ];

  return (
    <
      Modal
      title={
        <div>
          <p>项目：{props.pluginEureka?.project?.name}</p>
          <p>环境：{props.pluginEureka?.env?.name}</p>
        </div>
      }
      visible={props.pluginEureka?.visible}
      width='80%'
      footer={''}
      onCancel={() => {
        dispatch({
          type: 'pluginEureka/close',
        });
      }
      }
    >
      {
        props.pluginEureka?.eureka ? <div>
            <h3>Eureka注册APP名称：{props.pluginEureka?.eureka?.application.name}</h3>
            <Table dataSource={dataSource} columns={columns} rowKey='instanceId' pagination={false}/>
          </div>
          : <PageLoading/>
      }
    </Modal>
  );
};

export default connect(
  ({ pluginEureka }: PluginEurekaPageProps) => ({ pluginEureka }),
)(PluginEurekaIndex);
