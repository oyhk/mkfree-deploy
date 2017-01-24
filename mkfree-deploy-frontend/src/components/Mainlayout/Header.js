import React from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import {ROUTE_ADMIN_USERS, ROUTE_PROJECTS} from '../../constants';


function Header({location}) {


    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="horizontal"
            theme="dark"
        >
            <Menu.Item key={ROUTE_ADMIN_USERS}>
                <Link to={ROUTE_ADMIN_USERS}><Icon type="bars"/>用户管理</Link>
            </Menu.Item>
            <Menu.Item key={ROUTE_PROJECTS}>
                <Link to={ROUTE_PROJECTS}><Icon type="home"/>项目管理</Link>
            </Menu.Item>
            <Menu.Item key="/404">
                <Link to="/page-you-dont-know"><Icon type="frown-circle"/>404</Link>
            </Menu.Item>
            <Menu.Item key="/antd">
                <a href="https://github.com/dvajs/dva">dva</a>
            </Menu.Item>
        </Menu>
    );
}

export default Header;