import React from 'react';
import { Modal, Table } from 'antd';
import { connect, useDispatch } from 'umi';
import { PluginEurekaModelState } from '@/pages/project/models/PluginEurekaModel';
import { Dispatch } from '@@/plugin-dva/connect';
import { uuid } from '@/utils/utils';

interface PluginEurekaPageProps {
  pluginEureka?: PluginEurekaModelState;
  dispatch?: Dispatch;
}

const PluginEurekaIndex: React.FC<PluginEurekaPageProps> = props => {

  const dispatch = useDispatch();

  console.log('PluginEurekaIndex', props.pluginEureka?.visible);


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
      title: 'systemVersion',
      dataIndex: 'metadata',
      key: 'metadata',
      render: (metadata: any) => {
        return <div>{metadata.systemVersion}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },

  ];

  return (
    <Modal
      title={`项目：${props.pluginEureka?.project?.name} 环境：${props.pluginEureka?.env?.name}`}
      visible={props.pluginEureka?.visible}
      width='80%'
      footer={''}
      onOk={() => {

      }}
      onCancel={() => {
        dispatch({
          type: 'pluginEureka/close',
        });
      }}
    >
      <h3>Eureka注册APP名称：{props.pluginEureka?.eureka?.application.name}</h3>
      <Table dataSource={dataSource} columns={columns} key={uuid()}/>
    </Modal>
  );
};

export default connect(
  ({ pluginEureka }: PluginEurekaPageProps) => ({ pluginEureka }),
)(PluginEurekaIndex);
