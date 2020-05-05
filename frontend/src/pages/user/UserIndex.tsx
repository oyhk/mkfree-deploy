/**
 * title: Form and Table data binding
 * desc: useFormTable returns a search object after receiving a form instance.
 *
 * title.zh-CN: Form 与 Table 联动
 * desc.zh-CN: useFormTable 接收 form 实例后，会返回 search 对象。
 */

import React, { useEffect, useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// @ts-ignore
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Link, useParams, useLocation } from 'umi';
import routes from '@/routes';
import { UserAddOutlined, LeftOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import { ApiResult } from '@/services/ApiResult';
import { PageResult } from '@/services/PageResult';
import { UserDto } from '@/services/dto/UserDto';
import { Button, notification } from 'antd';
import { history } from '@@/core/history';


export default () => {

  const page = useRequest<ApiResult<PageResult<UserDto>>>(({ current, pageSize }) => {
      return ({
        url: `${routes.apiRoutes.userPage}?pageNo=${current}&pageSize=${pageSize}`,
        method: 'get',
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


  const delUrl = routes.apiRoutes.userDelete;
  const del = useRequest(({ id, username }) => ({
    url: routes.apiRoutes.userDelete,
    method: 'delete',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: { id, username },
  }), {
    manual: true,
    onSuccess: (data, params) => {
      if (data.code === 1) {
        notification.success({
          message: `用户：${params[0]?.username}`,
          description: '删除成功',
        });
        page.run({ current: 1, pageSize: 10 });
      } else {
        notification.error({
          message: `请求错误 ${data.code}: ${delUrl}`,
          description: data.desc,
        });
      }
    },
  });


  const columns: ProColumns<UserDto> = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户类型',
      dataIndex: 'roleType',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      dataIndex: '',
      render: (record: UserDto) => (
        <div>
          <Link to={`${routes.pageRoutes.userEditParams(record?.id)}`} type='primary'>编辑</Link>&nbsp;&nbsp;
          <Button type="dashed" danger size='small'
                  onClick={() => {
                    del.run({ id: record.id, username: record.username });
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
        loading={page.loading}
        columns={columns}
        rowKey="username"
        dataSource={page.data?.list}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.userCreate}><PlusOutlined/> 添加用户</Link>,
        ]}
        pagination={{
          ...page.pagination,
          onChange: (pageNo, pageSize) => {
            page.run({ current: pageNo, pageSize: pageSize ? pageSize : 10 });
          },
          showSizeChanger: false,
        }}
      />
    </PageHeaderWrapper>
  );
}
;
