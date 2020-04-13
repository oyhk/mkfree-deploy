import React from 'react';
import { SmileOutlined, TableOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link } from 'umi';

const BasicLayout: React.FC = props => {
  return (
    <ProLayout
      title='Mkfree Deploy'
      fixedHeader={true}
      fixSiderbar={true}
      menu={{ locale: false }}
      breadcrumbRender={(routers = []) => {
        return (
          [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ]
        );
      }}
      menuDataRender={(menuData) => {
        return (
          [
            {
              icon: <SmileOutlined/>,
              name: '欢迎',
              key: 'welcome',
              path: '/',
            },
            {
              icon: <TableOutlined/>,
              name: '项目管理',
              key: 'projectManager',
              path: '/project',
            },
          ]
        );
      }}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuRender={(_, dom) => dom}
    >
      {props.children}
    </ProLayout>
  );
};

export default BasicLayout;
