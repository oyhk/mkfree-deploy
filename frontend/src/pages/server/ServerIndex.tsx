import { PageHeaderWrapper } from '@ant-design/pro-layout';
// @ts-ignore
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Link } from 'umi';
import routes from '@/routes';
import React from 'react';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { PageResult } from '@/services/PageResult';
import { Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ServerDto } from '@/services/dto/ServerDto';

export default () => {

  const pageResult = useRequest<ApiResult<PageResult<ServerDto>>>(({ current, pageSize }) => {
      return ({
        url: `${routes.apiRoutes.serverPage.url}?pageNo=${current}&pageSize=${pageSize}`,
        method: routes.apiRoutes.serverPage.method,
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      });
    },
    {
      formatResult: (res: any) => ({
        list: res.result.data,
        total: res.result.total,
      }),
      manual: false,
      paginated: true,
    });


  const delResult = useRequest(({ id, ip }) => ({
    url: routes.apiRoutes.serverDelete.url,
    method: routes.apiRoutes.serverDelete.method,
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: { id, ip },
  }), {
    manual: true,
    onSuccess: (data, params) => {
      if (data.code === 1) {
        notification.success({
          message: `用户：${params[0]?.ip}`,
          description: '删除成功',
        });
        pageResult.run({ current: 1, pageSize: 10 });
      } else {
        notification.error({
          message: `请求错误 ${data.code}: ${routes.apiRoutes.serverDelete.url}`,
          description: data.desc,
        });
      }
    },
  });


  const columns: ProColumns<ServerDto> = [
    {
      title: '服务器名称',
      dataIndex: 'name',
    },
    {
      title: '内网ip',
      dataIndex: 'intranetIp',
    },
    {
      title: '外网ip',
      dataIndex: 'ip',
    },
    {
      title: 'ssh用户名',
      dataIndex: 'sshUsername',
    },
    {
      title: 'ssh端口',
      dataIndex: 'sshPort',
    },
    {
      title: '环境id',
      dataIndex: 'envId',
    },
    {
      title: '环境名称',
      dataIndex: 'envName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      dataIndex: '',
      render: (record: ServerDto) => (
        <div>
          <Link to={`${routes.pageRoutes.serverEditParams(record?.id)}`} type='primary'>编辑</Link>&nbsp;&nbsp;
          <Button type="dashed" danger size='small'
                  onClick={() => {
                    delResult.run({ id: record.id, username: record.name });
                  }}>删除</Button>
        </div>
      )
      ,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        search={false}
        loading={pageResult.loading}
        columns={columns}
        rowKey="id"
        dataSource={pageResult.data?.list}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.serverCreate}><PlusOutlined/> 添加服务器</Link>,
        ]}
        pagination={{
          ...pageResult.pagination,
          onChange: (pageNo, pageSize) => {
            pageResult.run({ current: pageNo, pageSize: pageSize ? pageSize : 10 });
          },
          showSizeChanger: false,
        }}
      />
    </PageHeaderWrapper>
  );
}
