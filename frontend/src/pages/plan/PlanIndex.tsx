import React from 'react';
import routes from '@/routes';
import { Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

export default () => {
  return (
    <div>
      <Link to={routes.pageRoutes.planCreate}><PlusOutlined/> 添加版本计划</Link>
    </div>
  );
};
