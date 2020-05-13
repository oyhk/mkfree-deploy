import React, { useEffect } from 'react';
import {
  SmileOutlined,
  TableOutlined,
  UserOutlined,
  DownOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import ProLayout, { MenuDataItem, DefaultFooter, PageLoading } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import { HeaderViewProps } from '@ant-design/pro-layout/es/Header';
import { Dropdown, Menu, Button } from 'antd';
import routes from '@/routes';
import { Footer } from '@/utils/ComponentUtils';
import {  USER_KEY } from '@/services/dto/UserDto';


const BaseLayout: React.FC = props => {

  useEffect(() => {
    const accessToken = localStorage.getItem(USER_KEY.ACCESS_TOKEN);
    if (!accessToken) {
      history.replace(routes.pageRoutes.userLogin);
    }
  });

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
              path: routes.pageRoutes.root,
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
              path: routes.pageRoutes.root,
            },
            {
              icon: <UserOutlined/>,
              name: '用户',
              key: 'user',
              path: routes.pageRoutes.userIndex,
              children: [
                {
                  name: '用户登录',
                  key: 'userLogin',
                  path: routes.pageRoutes.userLogin,
                  hideInMenu: true,
                },
                {
                  name: '用户创建',
                  key: 'userCreate',
                  path: routes.pageRoutes.userCreate,
                  hideInMenu: true,
                },
                {
                  name: '用户编辑',
                  key: 'userEdit',
                  path: routes.pageRoutes.userEdit,
                  hideInMenu: true,
                },
              ],
            },

            // 环境
            {
              icon: <EnvironmentOutlined/>,
              name: '环境',
              key: 'env',
              path: routes.pageRoutes.envIndex,
              children: [
                {
                  name: '环境创建',
                  key: 'envCreate',
                  path: routes.pageRoutes.envCreate,
                  hideInMenu: true,
                },
                {
                  name: '环境编辑',
                  key: 'envEdit',
                  path: routes.pageRoutes.envEdit,
                  hideInMenu: true,
                },
              ],
            },
            // 服务器
            {
              icon: <CloudServerOutlined/>,
              name: '服务器',
              key: 'server',
              path: routes.pageRoutes.serverIndex,
              children: [
                {
                  name: '服务器创建',
                  key: 'serverCreate',
                  path: routes.pageRoutes.serverCreate,
                  hideInMenu: true,
                },
                {
                  name: '服务器编辑',
                  key: 'serverEdit',
                  path: routes.pageRoutes.serverEdit,
                  hideInMenu: true,
                },
              ],
            },
            // 项目
            {
              icon: <DeploymentUnitOutlined/>,
              name: '项目',
              key: 'project',
              path: routes.pageRoutes.projectIndex,
              children: [
                {
                  name: '项目编辑',
                  key: 'projectEdit',
                  path: routes.pageRoutes.projectEdit,
                  hideInMenu: true,
                },
                {
                  name: '项目创建',
                  key: 'projectCreate',
                  path: routes.pageRoutes.projectCreate,
                  hideInMenu: true,
                },
                {
                  name: '项目环境日志',
                  key: 'projectEnvLog',
                  path: routes.pageRoutes.projectEnvLogIndex,
                  hideInMenu: true,
                },
              ],
            },
            // 版本计划
            {
              icon: <PushpinOutlined />,
              name: '版本计划',
              key: 'plan',
              path: routes.pageRoutes.planIndex,
              children: [
                // {
                //   name: '项目编辑',
                //   key: 'projectEdit',
                //   path: routes.pageRoutes.projectEdit,
                //   hideInMenu: true,
                // },
                {
                  name: '版本计划创建',
                  key: 'planCreate',
                  path: routes.pageRoutes.planCreate,
                  hideInMenu: true,
                },
                // {
                //   name: '项目环境日志',
                //   key: 'projectEnvLog',
                //   path: routes.pageRoutes.projectEnvLogIndex,
                //   hideInMenu: true,
                // },
              ],
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
                localStorage.removeItem(USER_KEY.USERNAME);
                localStorage.removeItem(USER_KEY.ACCESS_TOKEN);
                history.replace(routes.pageRoutes.userLogin);
              }}
            >
              <Menu.Item key="1">
                退出
              </Menu.Item>
            </Menu>
          }
          >
            <Button>{localStorage.getItem(USER_KEY.USERNAME)} <UserOutlined/></Button>
          </Dropdown>
        </div>;
      }}

      footerRender={() => Footer}
    >
      {props.children}
    </ProLayout>
  );
};
export default BaseLayout;
