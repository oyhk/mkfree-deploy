/* eslint-disable no-trailing-spaces */
import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Menu, Icon, Layout, Breadcrumb} from 'antd';

import {route} from '../Constant';

const {Header, Content, Footer} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;



function MainLayout({dispatch, children}) {
    return (
        <Layout className="layout">
            <Header style={{lineHeight: '63px'}}>
                <h1 style={{width: '200px', float: 'left', color: '#ffffff'}}>mkfree-deploy</h1>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{lineHeight: '64px'}}
                >
                    <Menu.Item key="1"><Link to={`${route.project}?pageSize=100`}>项目管理</Link></Menu.Item>
                    <Menu.Item key="2">用户管理</Menu.Item>
                    <Menu.Item key="3">服务器管理</Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '12px 0'}}>
                    <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{background: '#fff', padding: 24, minHeight: '81vh'}}>
                    {children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                mkfree-deploy ©2016 Created by mkfree
            </Footer>
        </Layout>
    );
}

MainLayout.propTypes = {};

function mapStateToProps(state) {
    const {index} = state.projectModel;
    return {index};
}

export default connect(mapStateToProps)(MainLayout);
