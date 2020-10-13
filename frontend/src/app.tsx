import routes from '@/routes';
import { HeaderViewProps } from '@ant-design/pro-layout/es/Header';
import { Button, Dropdown, Menu } from 'antd';
import { USER_KEY } from '@/services/dto/UserDto';
import { history } from '@@/core/history';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Footer } from '@/utils/ComponentUtils';

export const layout = {
  logout: () => {
  },
  breadcrumbRender: (routers = []) => {
    return (
      [
        {
          path: routes.pageRoutes.root,
          breadcrumbName: '首页',
        },
        ...routers,
      ]
    );
  },
  rightContentRender: (props: HeaderViewProps) => {
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
  },
  footerRender: () => Footer,
};
