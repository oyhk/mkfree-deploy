/* eslint-disable no-trailing-spaces */
import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Menu, Icon, Layout, Breadcrumb} from 'antd';

import {route} from '../Constant';

const {Header, Content, Footer} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


function MainLayout({dispatch, location, children}) {

    let pageTitle;
    let menuSelectKey;
    if (location.pathname.indexOf(route.project.url) > -1) {
        pageTitle = route.project.pageTitle;
        menuSelectKey = route.project.url;
    }
    if (location.pathname.indexOf(route.user.url) > -1) {
        pageTitle = route.user.pageTitle;
        menuSelectKey = route.user.url;
    }
    if (location.pathname.indexOf(route.serverMachine.url) > -1) {
        pageTitle = route.serverMachine.pageTitle;
        menuSelectKey = route.serverMachine.url;
    }


    return (
        <Layout className="layout">
            <Header style={{lineHeight: '63px'}}>
                <h1 style={{width: '200px', float: 'left', color: '#ffffff'}}>mkfree-deploy</h1>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[menuSelectKey]}
                    style={{lineHeight: '64px'}}
                >
                    <Menu.Item key={route.project.url}>
                        <Link to={`${route.project.url}?pageSize=100`}>{route.project.pageTitle}</Link>
                    </Menu.Item>
                    <Menu.Item key={route.user.url}>
                        <Link to={`${route.user.url}?pageSize=100`}>{route.user.pageTitle}</Link>
                    </Menu.Item>
                    <Menu.Item key={route.serverMachine.url}>
                        <Link to={`${route.serverMachine.url}?pageSize=100`}>{route.serverMachine.pageTitle}</Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '12px 0'}}>
                    <Breadcrumb.Item>
                        {pageTitle}
                    </Breadcrumb.Item>
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
