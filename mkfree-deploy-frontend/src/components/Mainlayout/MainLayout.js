import React from "react";
import styles from "./MainLayout.css";
import cookie from "react-cookie";
import {browserHistory} from "dva/router";
import {ROUTE_USERS_SIGN_IN, COOKIE_OPTIONS} from "../../constants";
import {Icon, Dropdown, Menu} from "antd";


function MainLayout({children, location}) {
    
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <a target="_blank"
                   rel="noopener noreferrer"
                   onClick={() => {
                       cookie.remove('user_token', COOKIE_OPTIONS);
                       cookie.remove('username', COOKIE_OPTIONS);
                       browserHistory.push(ROUTE_USERS_SIGN_IN);
                   }}>退出</a>
            </Menu.Item>
        </Menu>
    );
    
    return (
        <div className={styles.page_wrapper}>
            <div className={styles.logo}>
                <h1>mkfree-deploy</h1>
                <div style={{float: 'right'}}>
                    <Icon type="user"/>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="#">
                            {cookie.load('username')}
                            <Icon type="down"/>
                        </a>
                    </Dropdown>
                </div>
            </div>
            {children}
        </div>
    
    );
}

export default MainLayout;
