import React from "react";
import {Menu, Icon} from "antd";
import {Link} from "dva/router";
import BuildHistory from "./BuildHistory";
import {ROUTE_PROJECTS} from "../../constants";
import styles from "./Projects.css";


function Header({children, location}) {
    return (
        <div className={styles.normal}>
            <div className={styles.header}>
                <Menu
                    selectedKeys={[location.pathname]}
                    mode="inline "
                    theme="light"
                >
                    <Menu.Item key={ROUTE_PROJECTS}>
                        <Link to={ROUTE_PROJECTS}><Icon type="rollback"/>返回项目面板</Link>
                    </Menu.Item>
                    <Menu.Item key={'11'}>
                        <Link ><Icon type="bulb"/>状态</Link>
                    </Menu.Item>
                    <Menu.Item key={'22'}>
                        <Link ><Icon type="file-text"/>修改记录</Link>
                    </Menu.Item>
                    <Menu.Item key={'33'}>
                        <Link ><Icon type="folder-open"/>工作空间</Link>
                    </Menu.Item>
                </Menu>
                <BuildHistory />
            </div>
            <div className={styles.content}>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </div>
    
    );
}

export default Header;