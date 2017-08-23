import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function ProjectRoute({dispatch, pageResult}) {
    const columns = [{
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '部署',
        dataIndex: 'deploy',
        key: 'deploy',
        render: (text, record) => {

            const option = record.projectEnvConfigList.map((projectEnvConfig, projectEnvConfigIndex) => {

                const serverMachineList = projectEnvConfig.serverMachineIpList.map((ip, serverMachineIndex) => {

                    return ip === '' ? '' : <li key={serverMachineIndex} style={{marginTop: '5px'}}>


                        <Col span={3}
                             className={serverMachineIndex === 0 ? styles.project_env_li_first : styles.project_env_li_not_first}>{ip}</Col>
                        { serverMachineIndex === 0 ?
                            <Col span={21}
                                 className={serverMachineIndex === 0 ? styles.project_env_li_first : styles.project_env_li_not_first}>

                                {
                                    projectEnvConfig.env === 'DEV' ? <div><Dropdown overlay={<Menu
                                        onClick={(e) => {
                                            if (e.key === `${record.id}_dev_refresh`) {
                                                dispatch({
                                                    type: 'projectModel/branchRefresh',
                                                    payload: {
                                                        id: record.id
                                                    }
                                                });
                                            } else {

                                                dispatch({
                                                    type: 'projectModel/structure',
                                                    payload: {
                                                        id: record.id,
                                                        env: projectEnvConfig.env,
                                                        serverMachineIp: ip,
                                                        publishBranch: e.item.props.children
                                                    }
                                                });
                                            }
                                        }}><Menu.Item key={`${record.id}_dev_refresh`}><Icon type="reload"/>
                                        刷新分支</Menu.Item>{
                                        record.branchList && JSON.parse(record.branchList).map((item, index) => {
                                            return <Menu.Item key={`${record.id}_${item}`}>{item}</Menu.Item>;
                                        })
                                    }</Menu>} trigger={['hover']}>
                                        <Button size="small" type="primary">
                                            发布 <Icon type="down"/>
                                        </Button>
                                    </Dropdown>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {record.buildLog && record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`] && `服务器运行版本：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].buildVersion} 发布时间：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].createdAt}`}
                                    </div>
                                        :
                                        <div>
                                            <Button type="primary"
                                                    size="small"
                                                    onClick={() => {

                                                        dispatch({
                                                            type: 'projectModel/structure',
                                                            payload: {
                                                                id: record.id,
                                                                env: projectEnvConfig.env,
                                                                serverMachineIp: ip,
                                                            }
                                                        });
                                                    }}>发布</Button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {record.buildLog && record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`] && `服务器运行版本：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].buildVersion} 发布时间：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].createdAt}`}
                                        </div>
                                }


                            </Col>
                            :
                            <Col span={21}
                                 className={serverMachineIndex === 0 ? styles.project_env_li_first : styles.project_env_li_not_first}>
                                <Button type="danger"
                                        size="small"
                                        onClick={() => {
                                            dispatch({
                                                type: 'projectModel/sync',
                                                payload: {
                                                    id: record.id,
                                                    env: projectEnvConfig.env,
                                                    serverMachineIp: ip,
                                                }
                                            });
                                        }}>同步</Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {record.buildLog && record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`] && `服务器运行版本：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].buildVersion} 发布时间：${record.buildLog[`${record.id}_${ip}_${projectEnvConfig.env}`][0].createdAt}`}
                            </Col>
                        }
                    </li>;
                });
                return (
                    <Row key={projectEnvConfigIndex} type="flex" style={{paddingTop: '10px'}}>
                        <Col span={2} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>{projectEnvConfig.envText} :</Col>
                        <Col span={22}>
                            <ul>{serverMachineList}</ul>
                        </Col>
                    </Row>
                );
            });
            return (
                <div>
                    {option}
                </div>
            );
        },
    }, {
        title: '操作',
        dataIndex: 'options',
        key: 'options',
        render: (text, record) => {
            return <div>
                <Link to={route.project_build_log_path(record.id)}>构建日志</Link> &nbsp;&nbsp;
                <Link to={route.project_edit_path(record.id)}>编辑</Link>
            </div>;
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
            <Table dataSource={pageResult.list} columns={columns}
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
