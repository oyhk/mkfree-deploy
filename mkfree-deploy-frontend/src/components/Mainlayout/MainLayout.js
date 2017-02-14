import React from 'react';
import styles from './MainLayout.css';
import Header from './Header';
import cookie from "react-cookie";
import {browserHistory} from "dva/router";
import {ROUTE_USERS_SIGN_IN} from '../../constants';
import { Icon, Dropdown,Menu} from "antd";

let Options = {
    path: '/',
    maxAge: 30 * 24 * 60 * 60
}

function MainLayout({children, location}) {
  
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a target="_blank"
           rel="noopener noreferrer"
           onClick={() => {
             cookie.remove('user_token',Options);
             cookie.remove('username',Options);
             browserHistory.push(ROUTE_USERS_SIGN_IN);
           }}>退出</a>
      </Menu.Item>
    </Menu>
  );
  
    return (
      <div className={styles.page_wrapper}>
        <div className={styles.logo}>
          <h1>mkfree-deploy</h1>
          <div style={{float:'right'}}>
            <Icon type="user"/>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                {cookie.load('username')}
                <Icon type="down"/>
              </a>
            </Dropdown>
          </div>
          
        </div>
        <div className={styles.normal}>
          <Header location={location} />
          <div className={styles.content}>
            <div className={styles.main}>
              {children}
            </div>
          </div>
        </div>
      </div>
        
    );
}

export default MainLayout;
