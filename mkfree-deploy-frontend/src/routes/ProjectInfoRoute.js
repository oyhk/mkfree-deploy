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

function ProjectInfoRoute({dispatch, location, children, historyBuildLogList, project}) {

    return (
        <Row type="flex" style={{height: '73vh'}}>
            <Col span={4}>
                <Menu mode="inline" defaultSelectedKeys={['current_log']} inlineCollapsed={false}
                      openKeys={['history_build_log_lists']}>
                    <Menu.Item key="info">
                        <Icon type="info"/>
                        <span className="nav-text">详情</span>
                    </Menu.Item>
                    <Menu.Item key="current_log">
                        <Link to={project.id ? route.projectBuildLogPath(project.id) : ''}>
                            <Icon type="loading"/>
                            <span className="nav-text">构建中日志</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="history_build_log_lists" title={<span><Icon type="file"/><span>历史构建日志</span></span>}>
                        {
                            historyBuildLogList.map((item, index) => {
                                return <Menu.Item key={`history_build_log_list_${index}`}>
                                    <Link
                                        to={ project.id ? `${route.projectBuildLogInfoPath(project.id)}?seqNo=${item.seqNo}` : ''}>#{item.seqNo}</Link></Menu.Item>;
                            })
                        }

                    </SubMenu>
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
    const {historyBuildLogList, project} = state.ProjectInfoModel;
    return {historyBuildLogList, project};
}

export default connect(mapStateToProps)(ProjectInfoRoute);

