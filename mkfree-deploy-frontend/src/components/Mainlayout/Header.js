import React from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import {ROUTE_ADMIN_USERS, ROUTE_PROJECTS, ROUTE_ServerMachine} from '../../constants';
import styles from './MainLayout.css';


function Header({location}) {


    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="inline "
            theme="light"
            className={styles.header}
        >
            <Menu.Item key={ROUTE_ADMIN_USERS}>
                <Link to={ROUTE_ADMIN_USERS}><Icon type="bars"/>用户管理</Link>
            </Menu.Item>
            <Menu.Item key={ROUTE_PROJECTS}>
                <Link to={ROUTE_PROJECTS}><Icon type="home"/>项目管理</Link>
            </Menu.Item>
            <Menu.Item key={ROUTE_ServerMachine}>
                <Link to={ROUTE_ServerMachine}><Icon type="home"/>服务器管理</Link>
            </Menu.Item>
        </Menu>
    );
}

export default Header;
