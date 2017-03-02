import React from "react";
import {Menu, Icon} from "antd";
import {Link} from "dva/router";
import BuildHistory from "./BuildHistory";
import {ROUTE_PROJECTS, ROUTE_PROJECT_STRUCTURE_LOGS, ROUTE_PROJECTS_INFO} from "../../constants";
import styles from "./Projects.css";


function Header({children, location, params}) {
    const {project_name, id,}=params
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
                    <Menu.Item key={`${ROUTE_PROJECT_STRUCTURE_LOGS }/${project_name }/${id }/${ROUTE_PROJECTS_INFO}`}>
                        <Link
                            to={`${ROUTE_PROJECT_STRUCTURE_LOGS }/${project_name }/${id }/${ROUTE_PROJECTS_INFO}`}>
                            <Icon type="edit" />
                            编辑
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={'33'}>
                        <Link ><Icon type="folder-open"/>工作空间</Link>
                    </Menu.Item>
                </Menu>
                <BuildHistory location={location}/>
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
