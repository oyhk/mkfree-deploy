import React from 'react';
import { SmileOutlined, TableOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem, DefaultFooter } from '@ant-design/pro-layout';
import { Link } from 'umi';
import { HeaderViewProps } from '@ant-design/pro-layout/es/Header';


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

      rightContentRender={(props: HeaderViewProps) => {
        console.log(props);
        return <div>123123</div>;
      }}

      footerRender={() => <DefaultFooter
        copyright="MKfree Deploy 2016-2020"
        links={[
          {
            key: 'Mkfree Deploy',
            title: 'Mkfree Deploy',
            href: 'https://gitee.com/381895649/mkfree-deploy',
            blankTarget: true,
          },
        ]}
      />}
    >
      {props.children}
    </ProLayout>
  );
};

export default BasicLayout;
