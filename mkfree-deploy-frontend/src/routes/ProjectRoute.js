import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag, Affix} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';

const {CheckableTag} = Tag;


function ProjectRoute({dispatch, location, pageResult}) {


    return (
        <div>
            <Row>
                <Col span={23}>
                    <Link onClick={() => {
                        const page = location.query.page ? location.query.page : 0;
                        const pageSize = location.query.pageSize;
                        browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=ALL`);
                    }}>全部</Link>&nbsp;&nbsp;
                    <Link onClick={() => {
                        const page = location.query.page ? location.query.page : 0;
                        const pageSize = location.query.pageSize;
                        browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=1`);
                    }}>后端</Link>&nbsp;&nbsp;
                    <Link color="red" checked onClick={() => {
                        const page = location.query.page ? location.query.page : 0;
                        const pageSize = location.query.pageSize;
                        browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=2`);
                    }}>前端</Link>&nbsp;&nbsp;
                    <Link color="red" checked onClick={() => {
                        const page = location.query.page ? location.query.page : 0;
                        const pageSize = location.query.pageSize;
                        browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=3`);
                    }}>antbox-cloud</Link>&nbsp;&nbsp;

                </Col>
                <Col span={1}>
                    <Button type="primary"
                            onClick={() => {
                                browserHistory.push(route.projectAdd);
                            }}
                    >添加</Button>
                </Col>
            </Row>
            <Affix>
                <Row type="flex" align="middle" justify="center"
                     style={{paddingBottom: '20px', paddingTop: '20px', backgroundColor: '#ffffff'}}>
                    <Col style={{width: '16.2%'}}><h4>项目名称</h4></Col>
                    <Col style={{width: '7.9%'}}><h4>环境</h4></Col>
                    <Col style={{width: '15.1%'}}><h4>ip</h4></Col>
                    <Col style={{width: '8.7%'}}><h4>发布时间</h4></Col>
                    <Col style={{width: '26%'}}><h4>服务器运行版本</h4></Col>
                    <Col style={{width: '8.1%'}}><h4>发布版本</h4></Col>
                    <Col style={{width: '17%'}}><h4>操作</h4></Col>
                </Row>
            </Affix>

            {
                pageResult.list && pageResult.list.map((project, index) => {
                    return (
                        <Row className={styles.projectPage} type="flex" align="middle" key={`page_row_${index}`}
                             style={{
                                 borderBottom: pageResult.list && pageResult.list.length - 1 === index ? '' : '1px solid #e9e9e9',
                                 paddingTop: '10px'
                             }}>
                            <Col lg={4} xl={4} md={4} sm={4} xs={4}>{project.name}</Col>
                            <Col lg={15} xl={15} md={15} sm={15} xs={15}>
                                {
                                    project.projectEnvList && project.projectEnvList.map((projectEnv, projectEnvIndex) => {
                                        return (
                                            <Row type="flex" align="middle" key={`projectEnvList_${projectEnvIndex}`}
                                                 style={{
                                                     paddingBottom: '10px',
                                                     paddingTop: '10px',

                                                     borderBottom: project.projectEnvList && project.projectEnvList.length - 1 === projectEnvIndex ? '' : '1px solid #e9e9e9'

                                                 }}>
                                                <Col lg={3}>{projectEnv.name}</Col>
                                                <Col lg={20}>
                                                    {
                                                        projectEnv.projectEnvIpList && projectEnv.projectEnvIpList.map((projectEnvIp, projectEnvIpIndex) => {
                                                            return <Row type="flex" align="middle"
                                                                        key={`ipList_${projectEnvIpIndex}`}>
                                                                <Col lg={7} style={{
                                                                    paddingBottom: '10px',
                                                                    paddingTop: '10px'
                                                                }}>{projectEnvIp.serverIp ? `${projectEnvIp.serverIp}_${projectEnvIp.serverName}` : ''}</Col>
                                                                <Col lg={4}>{projectEnvIp.publishTime}</Col>

                                                                <Col lg={12}
                                                                     style={{wordWrap: 'break-word'}}>{projectEnvIp.publishVersion}</Col>
                                                                <Col lg={1}>
                                                                    {
                                                                        projectEnvIp.serverIp ?
                                                                            projectEnvIp.publish ? projectEnvIp.projectEnv === 'DEV'?
                                                                                <Dropdown overlay={<Menu
                                                                                    onClick={(e) => {
                                                                                        dispatch({
                                                                                            type: 'projectModel/structure',
                                                                                            payload: {
                                                                                                id: projectEnvIp.projectId,
                                                                                                env: projectEnvIp.projectEnv,
                                                                                                serverMachineIp: projectEnvIp.serverIp,
                                                                                                publishBranch: e.item.props.children
                                                                                            }
                                                                                        });
                                                                                    }}>
                                                                                    {
                                                                                        project.branchList && JSON.parse(project.branchList).map((item, branchListIndex) => {
                                                                                            return <Menu.Item key={`${project.id}_${branchListIndex}`}>{item}</Menu.Item>;
                                                                                        })
                                                                                    }</Menu>} trigger={['hover']}>
                                                                                    <Button size="small" type="primary">
                                                                                        发布 <Icon type="down"/>
                                                                                    </Button>
                                                                                </Dropdown>
                                                                                :
                                                                                <Button type="primary"
                                                                                        size="small"
                                                                                        onClick={() => {
                                                                                            dispatch({
                                                                                                type: 'projectModel/structure',
                                                                                                payload: {
                                                                                                    id: projectEnvIp.projectId,
                                                                                                    env: projectEnvIp.projectEnv,
                                                                                                    serverMachineIp: projectEnvIp.serverIp,
                                                                                                }
                                                                                            });
                                                                                        }}>发布</Button>
                                                                                : <Button type="danger"
                                                                                          size="small"
                                                                                          onClick={() => {
                                                                                              dispatch({
                                                                                                  type: 'projectModel/sync',
                                                                                                  payload: {
                                                                                                      id: projectEnvIp.projectId,
                                                                                                      env: projectEnvIp.projectEnv,
                                                                                                      serverMachineIp: projectEnvIp.serverIp,
                                                                                                  }
                                                                                              });
                                                                                          }}>同步</Button>
                                                                            : ''
                                                                    }
                                                                </Col>
                                                            </Row>;
                                                        })
                                                    }
                                                </Col>
                                            </Row>
                                        );
                                    })
                                }
                            </Col>
                            <Col lg={5} xl={5} md={5} sm={5} xs={5} style={{textAlign: 'center'}}>
                                <Link to={route.projectBuildLogPath(project.id)}
                                      target="_blank">查看日志</Link> &nbsp;&nbsp;
                                <Link to={route.projectEditPath(project.id)}>编辑</Link> &nbsp;&nbsp;

                                <Link onClick={() => {
                                    dispatch({
                                        type: 'projectModel/branchRefresh',
                                        payload: {
                                            id: project.id,
                                            query: location.query
                                        }
                                    });
                                }}>刷新分支</Link> &nbsp;&nbsp;
                                <Popconfirm title="确定删除此项目吗？" onConfirm={() => {
                                    dispatch({
                                        type: 'projectModel/deleted',
                                        payload: {
                                            id: project.id,

                                        }
                                    });
                                }} okText="Yes" cancelText="No">
                                    <Link>删除</Link>
                                </Popconfirm> &nbsp;&nbsp;
                                <Popconfirm title="确定初始化此项目吗？" onConfirm={() => {
                                    dispatch({
                                        type: 'projectModel/initGit',
                                        payload: {
                                            id: project.id
                                        }
                                    });
                                }} okText="Yes" cancelText="No">
                                    <Link>初始化</Link>
                                </Popconfirm>
                            </Col>
                        </Row>);
                })
            }

        </div>
    );
}

ProjectRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.projectModel;
    return {pageResult};
}

export default connect(mapStateToProps)(ProjectRoute);
