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
import ProTable from '@ant-design/pro-table';
import { Link, useParams, useLocation } from 'umi';
import routes from '@/routes';
import { UserAddOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { UserDto } from '@/services/dto/UserDto';


export default () => {

  const [pageNo, setPageNo] = useState(1);

  const { data, run } = useRequest(({ current, pageSize }) => {

      return ({
        url: `http://localhost:5000/api/users/page?pageNo=${current}&pageSize=${pageSize}`,
        method: 'get',
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      });
    }
    ,
    {
      manual: false,
      paginated: true,
    });


  const columns = [
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
      dataIndex: 'createAt',
    },
  ];

  console.log('pageNo', pageNo);
  return (
    <PageHeaderWrapper>
      <ProTable
        search={false}
        columns={columns} rowKey="username"
        dataSource={data?.result?.data}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.userCreate}><UserAddOutlined/> 添加用户</Link>,
        ]}
        pagination={{
          total: data?.result?.total,
          defaultPageSize: 10,
          onChange: (page, pageSize) => {
            run({ current: page, pageSize: pageSize });
          },
          showSizeChanger: false,
        }}
      />
    </PageHeaderWrapper>
  );
};
