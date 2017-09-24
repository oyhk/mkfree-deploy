import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function ProjectRoute({dispatch, pageResult}) {
    const columns = [{
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        render: (value, record, columnIndex) => {

            const obj = {
                children: value,
                props: {},
            };
            obj.props.rowSpan = record.projectNameAntTableRowSpan;
            return obj;
        }
    }, {
        title: '环境',
        dataIndex: 'projectEnvText',
        key: 'projectEnvText',
        render: (value, record, columnIndex) => {

            const obj = {
                children: <p>{value}</p>,
                props: {},
            };
            obj.props.rowSpan = record.projectEnvAntTableRowSpan;
            return obj;
        }
    }, {
        title: 'ip',
        dataIndex: 'ip',
        key: 'ip',
    }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
    }, {
        title: '服务器运行版本',
        dataIndex: 'publishVersion',
        key: 'publishVersion',
    }, {
        title: '发布版本',
        dataIndex: 'publishOption',
        key: 'publishOption',
        render: (value, record, columnIndex) => {
            return (
                !record.ip ? '' :
                    record.projectEnv === 'DEV' ? <div><Dropdown overlay={<Menu
                        onClick={(e) => {
                            dispatch({
                                type: 'projectModel/structure',
                                payload: {
                                    id: record.id,
                                    env: record.projectEnv,
                                    serverMachineIp: record.ip,
                                    publishBranch: e.item.props.children
                                }
                            });
                        }}>
                        {
                            record.branchList && JSON.parse(record.branchList).map((item, index) => {
                                return <Menu.Item key={`${record.id}_${item}`}>{item}</Menu.Item>;
                            })
                        }</Menu>} trigger={['hover']}>
                        <Button size="small" type="primary">
                            发布 <Icon type="down"/>
                        </Button>
                    </Dropdown>
                    </div> : (
                        record.projectEnvAntTableRowSpan > 0 ?
                            <Button type="primary"
                                    size="small"
                                    onClick={() => {
                                        dispatch({
                                            type: 'projectModel/structure',
                                            payload: {
                                                id: record.id,
                                                env: record.projectEnv,
                                                serverMachineIp: record.ip,
                                            }
                                        });
                                    }}>发布</Button>
                            :
                            <Button type="danger"
                                    size="small"
                                    onClick={() => {
                                        dispatch({
                                            type: 'projectModel/sync',
                                            payload: {
                                                id: record.id,
                                                env: record.projectEnv,
                                                serverMachineIp: record.ip,
                                            }
                                        });
                                    }}>同步</Button>)
            );
        }
    }, {
        title: '构建日志',
        dataIndex: 'buildLog',
        key: 'buildLog',
        render: (value, record, columnIndex) => {
            return (
                record.publishVersion ? <Link to={route.project_build_log_path(record.id)} target="_blank">查看日志</Link> : ''

            );
        }
    }, {
        title: '操作',
        dataIndex: 'options',
        key: 'options',
        render: (text, record, columnIndex) => {
            const obj = {
                children: <div style={{textAlign:'center'}}>
                    <Link to={route.project_edit_path(record.id)}>编辑</Link> &nbsp;&nbsp;
                    <Link onClick={()=>{
                        dispatch({
                            type: 'projectModel/branchRefresh',
                            payload: {
                                id: record.id
                            }
                        });
                    }}>刷新分支</Link> &nbsp;&nbsp;
                    <Popconfirm title="确定删除此项目吗？" onConfirm={() => {
                        dispatch({
                            type: 'projectModel/deleted',
                            payload: {
                                id: record.id
                            }
                        });
                    }} okText="Yes" cancelText="No">
                        <Link>删除</Link>
                    </Popconfirm> &nbsp;&nbsp;
                    <Popconfirm title="确定初始化此项目吗？" onConfirm={() => {
                        dispatch({
                            type: 'projectModel/initGit',
                            payload: {
                                id: record.id
                            }
                        });
                    }} okText="Yes" cancelText="No">
                        <Link>初始化</Link>
                    </Popconfirm>
                </div>,
                props: {},
            };
            obj.props.rowSpan = record.projectNameAntTableRowSpan;
            return obj;
        }
    }];


    return (
        <div>
            <div style={{marginBottom: '16px'}}>
                <Button type="primary"
                        onClick={() => {
                            browserHistory.push(route.projectAdd);
                        }}
                >添加</Button>
            </div>
            <Table dataSource={pageResult.list}
                   columns={columns}
                   pagination={{
                       defaultPageSize: 100,
                       current: pageResult.pageNo + 1,
                       defaultCurrent: pageResult.pageNo + 1,
                       total: pageResult.totalCount,
                       onChange: (page, pageSize) => {
                           browserHistory.push(`${route.project}?pageNo=${page}&pageSize=${pageSize}`);
                       }
                   }}/>
        </div>
    );
}

ProjectRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.projectModel;
    return {pageResult};
}

export default connect(mapStateToProps)(ProjectRoute);
