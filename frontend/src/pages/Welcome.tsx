import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Space, Tag } from 'antd';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import { PlusOutlined } from '@ant-design/icons';


interface GithubIssueItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  author_association: string;
  body: string;
}

interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    width: '30%',
    hideInSearch: true,
  },
  {
    title: '状态',
    dataIndex: 'state',
    initialValue: 'all',
    filters: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
    width: '10%',
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: '10%',
    render: (_, row) => (
      <Space>
        {row.labels.map(({ name, id, color }) => (
          <Tag color={color} key={id}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    width: '20%',
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, row, _, action) => [
      <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="link">
        链路
      </a>,
      <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="warning">
        报警
      </a>,
      <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];


const Welcome: React.FC = () => {
  return (
    <PageHeaderWrapper>
      Hello World!


      <ProTable<GithubIssueItem>
        columns={columns}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        request={
          async (params = {}) => {
            console.log('params', params);

            return (
              request<{
                data: GithubIssueItem[];
              }>('https://proapi.azurewebsites.net/github/issues', {
                params,
              })
            );
          }
        }
        rowKey="id"
        dateFormatter="string"
        headerTitle="轻量筛选表格"
        toolBarRender={() => [
          <Button key="3" type="primary">
            <PlusOutlined/>
            新建
          </Button>,
        ]}
      />
    </PageHeaderWrapper>
  );
};
export default Welcome;
