import React from 'react';
import routes from '@/routes';
import { Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { EnvDto } from '@/services/dto/EnvDto';
import { momentFormat } from '@/utils/utils';
import { Button, notification } from 'antd';
import { PlanDto } from '@/services/dto/PlanDto';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { PageResult } from '@/services/PageResult';

export default () => {

  const paginatedResult = useRequest<ApiResult<PageResult<EnvDto>>>(
    ({ current, pageSize }) => routes.apiRoutes.planPage({
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


  const deleteUseRequest = useRequest((payload) => routes.apiRoutes.planDelete(payload), {
    manual: true,
    onSuccess: (apiResult, params) => {
      if (apiResult) {
        notification.success({
          message: `版本计划：${params[0]?.name}`,
          description: '删除成功',
        });
        paginatedResult.run({ current: 1, pageSize: 10 });
      }
    },
    refreshOnWindowFocus: false,
  });


  const columns: ProColumns<PlanDto> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <div>{momentFormat(createdAt)}</div>,
    },
    {
      title: '操作',
      dataIndex: '',
      render: (record: PlanDto) => (
        <div>
          <Link to={`${routes.pageRoutes.planEditParams(record?.id)}`} type='primary'>编辑</Link>&nbsp;&nbsp;
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
          <Link to={routes.pageRoutes.planCreate}><PlusOutlined/> 添加版本计划</Link>,
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
};
