import React from 'react';
import styles from './MainLayout.css';
import Header from './Header';
import cookie from "react-cookie";
import {browserHistory} from "dva/router";
import {ROUTE_USERS} from '../../constants';
import { Icon, Dropdown,Menu} from "antd";




function MainLayout({children, location}) {
  
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a target="_blank"
           rel="noopener noreferrer"
           onClick={() => {
             cookie.remove('user_token');
             cookie.remove('username');
             browserHistory.push(ROUTE_USERS);
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
          <Header location={location} className={styles.header}/>
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
