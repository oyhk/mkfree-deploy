import React from 'react';
import routes from '@/routes';
import { Link } from 'umi';
import { PlusOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table/lib/Table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { EnvDto } from '@/services/dto/EnvDto';
import { momentFormat, uuid } from '@/utils/utils';
import { Button, notification, Table } from 'antd';
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


  return (
    <PageHeaderWrapper>
      <ProTable
        loading={paginatedResult.loading}
        search={false}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: PlanDto) => <Link
              to={routes.pageRoutes.planInfoParams(record.id)}>{name}</Link>,
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: Date) => <div>{momentFormat(createdAt)}</div>,
          },
          {
            title: '操作',
            key: 'operations',
            render: (record: PlanDto) => <div><Link to={`${routes.pageRoutes.planEditParams(record?.id)}`}
                                                    type='primary'>编辑</Link>&nbsp;&nbsp;</div>,
          },
        ]}
        rowKey="id"
        dataSource={paginatedResult.data?.list}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.planCreate}><PlusOutlined/> 添加版本计划</Link>,
        ]}
        headerTitle={<div><Link to={routes.pageRoutes.planProjectSort}><DeploymentUnitOutlined/> 项目排序配置</Link></div>}
        expandable={
          {
            expandedRowRender: (record) => {
              return <Table
                rowKey={uuid()}
                columns={
                  [
                    { title: '环境名称', key: 'envName', dataIndex: 'envName' },
                    {
                      title: 'DevOps', key: 'DevOps', dataIndex: 'DevOps', render: () => {
                        return <div>
                          <Button type='primary' size='small'>首次灰度发布</Button>&nbsp;&nbsp;
                          <Button type='primary' size='small'>灰度发布</Button>&nbsp;&nbsp;
                          <Button danger type='primary' size='small'>正式发布</Button>&nbsp;&nbsp;
                        </div>;
                      },
                    },
                  ]
                }
                dataSource={record.planEnvList}
                pagination={false}
                footer={() => <div/>}/>;
            },
            defaultExpandAllRows: true,
          }
        }
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
