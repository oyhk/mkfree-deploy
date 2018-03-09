/**
 * Created by oyhk on 2018/3/5.
 */
import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag, Affix, Tooltip, Layout} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function ProjectInfoRoute({dispatch, location,children}) {
    return (
        <Row type="flex">
            <Col span={4}>
                <Menu mode="inline" defaultSelectedKeys={['current_log']} inlineCollapsed={false}
                      openKeys={['history_build_log_lists', 'history_sync_log_lists']}>
                    <SubMenu key="history_build_log_lists" title={<span><Icon type="file"/><span>历史构建日志</span></span>}>
                        <Menu.Item key="current_log">构建中日志</Menu.Item>
                        <Menu.Item key="6">20180222_release_2.13.0_3c6c1175243b</Menu.Item>
                        <Menu.Item key="7">20180129_release_2.12.0_2d7f23d36d43</Menu.Item>
                        <Menu.Item key="8">20180129_release_2.12.0_60b6122bbb62</Menu.Item>
                    </SubMenu>
                    <SubMenu key="history_sync_log_lists" title={<span><Icon type="file"/><span>历史同步日志</span></span>}>
                        <Menu.Item key="9">20180222_release_2.13.0_3c6c1175243b</Menu.Item>
                        <Menu.Item key="10">20180129_release_2.12.0_2d7f23d36d43</Menu.Item>
                        <Menu.Item key="11">20180129_release_2.12.0_60b6122bbb62</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="info">
                        <Icon type="video-camera"/>
                        <span className="nav-text">详情</span>
                    </Menu.Item>
                </Menu>
            </Col>
            <Col span={20} style={{paddingLeft: '20px'}}>
                {children}
            </Col>
        </Row>
    );
}

ProjectInfoRoute.propTypes = {};

function mapStateToProps(state) {
    const {} = state.projectModel;
    return {};
}

export default connect(mapStateToProps)(ProjectInfoRoute);

