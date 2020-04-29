import React from 'react';
import { SmileOutlined, TableOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import ProLayout, { MenuDataItem, DefaultFooter, PageLoading } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import { HeaderViewProps } from '@ant-design/pro-layout/es/Header';
import { Dropdown, Menu, Button } from 'antd';
import { ConnectProps } from '@@/plugin-dva/connect';
import routes from '@/routes';


const BasicLayout: React.FC<ConnectProps> = ({ dispatch, children }) => {
  if (!dispatch) {
    return <PageLoading/>;
  }
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
              key: 'project',
              path: routes.pageRoutes.projectIndex,
            },
            {
              name: '项目环境日志',
              key: 'projectEnvLog',
              path: routes.pageRoutes.projectEnvLogIndex,
              hideInMenu:true
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
        return <div style={{ paddingRight: '20px' }}>
          <Dropdown overlay={
            <Menu
              onClick={() => {
                dispatch({
                  type:'user/logout'
                });
              }}
            >
              <Menu.Item key="1">
                退出
              </Menu.Item>
            </Menu>
          }
          >
            <Button>{localStorage.getItem('username')} <UserOutlined/></Button>
          </Dropdown>
        </div>;
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
      {children}
    </ProLayout>
  );
};

export default connect(({}: ConnectProps) => ({}),
)(BasicLayout);
