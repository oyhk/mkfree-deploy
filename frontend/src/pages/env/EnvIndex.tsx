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
import { EnvDto } from '@/services/dto/EnvDto';
import { momentFormat } from '@/utils/utils';

export default () => {

  const paginatedResult = useRequest<ApiResult<PageResult<EnvDto>>>(
    ({ current, pageSize }) => routes.apiRoutes.envPage({
      pageNo: current,
      pageSize,
    })
    ,
    {
      formatResult: (res: any) => ({
        list: res?.result?.data,
        total: res?.result?.total,
      }),
      manual: false,
      paginated: true,
      refreshOnWindowFocus: false,
    });


  const deleteUseRequest = useRequest(({ id, name }) => {
    return ({
      url: routes.apiRoutes.envDelete.url,
      method: routes.apiRoutes.envDelete.method,
      data: { id, name },
    });
  }, {
    manual: true,
    onSuccess: (apiResult, params) => {
      if (apiResult) {
        notification.success({
          message: `环境：${params[0]?.name}`,
          description: '删除成功',
        });
        paginatedResult.run({ current: 1, pageSize: 10 });
      }
    },
    refreshOnWindowFocus: false,
  });


  const columns: ProColumns<EnvDto> = [
    {
      title: '环境名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      render: ((isEnable: boolean) => <div>{isEnable ? '启用' : '禁用'}</div>),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <div>{momentFormat(createdAt)}</div>,
    },
    {
      title: '操作',
      dataIndex: '',
      render: (record: EnvDto) => (
        <div>
          <Link to={`${routes.pageRoutes.envEditParams(record?.id)}`} type='primary'>编辑</Link>&nbsp;&nbsp;
          <Button type="dashed" danger size='small'
                  onClick={() => {
                    deleteUseRequest.run({ id: record.id, name: record.name });
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
        loading={paginatedResult.loading}
        columns={columns}
        rowKey="id"
        dataSource={paginatedResult.data?.list}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.envCreate}><PlusOutlined/> 添加环境</Link>,
        ]}
        pagination={{
          ...paginatedResult.pagination,
          onChange: (pageNo, pageSize) => {
            paginatedResult.run({ current: pageNo, pageSize: pageSize ? pageSize : 10 });
          },
          showSizeChanger: false,
        }}
      />
    </PageHeaderWrapper>
  );
}
