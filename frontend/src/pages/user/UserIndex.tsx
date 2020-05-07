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


export default () => {

  const pageUseRequest = useRequest<ApiResult<PageResult<UserDto>>>(({ current, pageSize = 20 }) => {
      return ({
        url: `${routes.apiRoutes.userPage}?pageNo=${current}&pageSize=${pageSize}`,
        method: 'get',
      });
    },
    {
      formatResult: (res: any) => ({
        list: res.result.data,
        total: res.result.total,
      }),
      manual: false,
      paginated: true,
      refreshOnWindowFocus: false,
    });


  const del = useRequest(({ id, username }) => ({
    ...routes.apiRoutes.userDelete,
    data: { id, username },
  }), {
    manual: true,
    refreshOnWindowFocus: false,
    onSuccess: (data, params) => {
      if (data) {
        notification.success({
          message: `用户：${params[0]?.username}`,
          description: '删除成功',
        });
        pageUseRequest.run({ current: 1, pageSize: 10 });
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
        loading={pageUseRequest.loading}
        columns={columns}
        rowKey="username"
        dataSource={pageUseRequest.data?.list}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.userCreate}><PlusOutlined/> 添加用户</Link>,
        ]}
        pagination={{
          ...pageUseRequest.pagination,
          onChange: (pageNo, pageSize) => {
            pageUseRequest.run({ current: pageNo, pageSize: pageSize ? pageSize : 10 });
          },
          showSizeChanger: false,
        }}
      />
    </PageHeaderWrapper>
  );
}
;
