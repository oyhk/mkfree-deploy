/* eslint-disable no-trailing-spaces */
import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Menu, Icon, Layout, Row, Col, Breadcrumb, Popconfirm} from 'antd';

import cookie from 'react-cookie';

import {route, user} from '../Constant';

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
    if (location.pathname.indexOf(route.env.url) > -1) {
        pageTitle = route.env.pageTitle;
        menuSelectKey = route.env.url;
    }
    if (location.pathname.indexOf(route.tag.url) > -1) {
        pageTitle = route.tag.pageTitle;
        menuSelectKey = route.tag.url;
    }


    return (
        <Layout className="layout">
            <Header style={{lineHeight: '63px'}}>
                <Row type="flex">
                    <Col span={22}>
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
                                <Link
                                    to={`${route.serverMachine.url}?pageSize=100`}>{route.serverMachine.pageTitle}</Link>
                            </Menu.Item>
                            <Menu.Item key={route.env.url}>
                                <Link to={`${route.env.url}?pageSize=100`}>{route.env.pageTitle}</Link>
                            </Menu.Item>
                            <Menu.Item key={route.tag.url}>
                                <Link to={`${route.tag.url}?pageSize=100`}>{route.tag.pageTitle}</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={2} style={{textAlign: 'right', color: '#ffffff'}}>

                        <Popconfirm title="确定退出系统吗？"
                                    onConfirm={() => {
                                        cookie.remove(user.username);
                                        cookie.remove(user.accessToken);
                                        window.location.replace(route.signIn.url);
                                    }} okText="Yes" cancelText="No">
                            {cookie.load(user.username)} <Icon type="logout"
                                                               style={{cursor: 'pointer'}}/></Popconfirm></Col>
                </Row>
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
