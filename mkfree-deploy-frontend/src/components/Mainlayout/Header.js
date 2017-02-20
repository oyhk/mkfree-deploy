import React from "react";
import {Menu, Icon} from "antd";
import {Link} from "dva/router";
import {ROUTE_USERS, ROUTE_PROJECTS, ROUTE_ServerMachine} from "../../constants";
import styles from "./MainLayout.css";


function Header({children,location}) {
    return (
        <div className={styles.normal}>
            <Menu
                selectedKeys={[location.pathname]}
                mode="inline "
                theme="light"
                className={styles.header}
            >
                <Menu.Item key={ROUTE_USERS}>
                    <Link to={ROUTE_USERS}><Icon type="bars"/>用户管理</Link>
                </Menu.Item>
                <Menu.Item key={ROUTE_PROJECTS}>
                    <Link to={ROUTE_PROJECTS}><Icon type="home"/>项目管理</Link>
                </Menu.Item>
                <Menu.Item key={ROUTE_ServerMachine}>
                    <Link to={ROUTE_ServerMachine}><Icon type="home"/>服务器管理</Link>
                </Menu.Item>
            </Menu>
            <div className={styles.content}>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </div>
    
    );
}

export default Header;
