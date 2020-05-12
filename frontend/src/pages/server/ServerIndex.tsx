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
import { USER_KEY } from '@/services/dto/UserDto';
import { momentFormat } from '@/utils/utils';

export default () => {

  const pageResult = useRequest<ApiResult<PageResult<ServerDto>>>(({ current, pageSize }) => {
      return ({
        url: `${routes.apiRoutes.serverPage.url}?pageNo=${current}&pageSize=${pageSize}`,
        method: routes.apiRoutes.serverPage.method,
        headers: {
          access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
        },
      });
    },
    {
      formatResult: (res: any) => ({
        list: res?.result?.data,
        total: res?.result?.total,
      }),
      manual: false,
      paginated: true,
      refreshOnWindowFocus: false,
    });


  const delResult = useRequest(({ id, ip }) => ({
    url: routes.apiRoutes.serverDelete.url,
    method: routes.apiRoutes.serverDelete.method,
    headers: {
      access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
    },
    data: { id, ip },
  }), {
    manual: true,
    onSuccess: (data, params) => {
      if (data.result) {
        notification.success({
          message: `服务器：${params[0]?.ip}`,
          description: '删除成功',
        });
        pageResult.run({ current: 1, pageSize: 10 });
      }
    },
    refreshOnWindowFocus: false,
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
      title: '环境名称',
      dataIndex: 'envName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <div>{momentFormat(createdAt)}</div>,
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
