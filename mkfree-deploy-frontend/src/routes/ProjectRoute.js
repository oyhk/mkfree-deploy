import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tabs, Tag, Affix, Tooltip, Modal} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';

const TabPane = Tabs.TabPane;

const {CheckableTag} = Tag;


function ProjectRoute({dispatch, location, pageResult, tagList, eureka}) {


    return (
        <div>
            <Affix>
                <Row type="flex" style={{paddingTop: '20px', backgroundColor: '#ffffff'}}>
                    <Col span={22}>
                        <Link onClick={() => {
                            const page = location.query.page ? location.query.page : 0;
                            const pageSize = location.query.pageSize;
                            browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=ALL`);
                        }}>全部</Link>&nbsp;&nbsp;
                        {
                            tagList && tagList.map((tag, tagIndex) => {
                                return <Link key={`tagList_key_index_${tagIndex}`} style={{marginRight: '10px'}}
                                             onClick={() => {
                                                 const page = location.query.page ? location.query.page : 0;
                                                 const pageSize = location.query.pageSize;
                                                 browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&projectTagId=${tag.id}`);
                                             }}>{tag.name}</Link>;

                            })
                        }
                        |<Link style={{marginLeft: '10px'}} onClick={() => {
                        const page = location.query.page ? location.query.page : 0;
                        const pageSize = location.query.pageSize;
                        browserHistory.push(`${route.project.url}?pageNo=${page}&pageSize=${pageSize}&type=checkSync`);
                    }}>版本不同步项目</Link>
                    </Col>
                    <Col span={2} style={{textAlign: 'right'}}>
                        <Button type="primary"
                                onClick={() => {
                                    browserHistory.push(route.projectAdd);
                                }}
                        >添加</Button>
                    </Col>
                </Row>

                <Row type="flex" align="middle" justify="center"
                     style={{paddingBottom: '20px', paddingTop: '20px', backgroundColor: '#f7f7f7'}}>
                    <Col style={{width: '3%'}}><h4>id</h4></Col>
                    <Col style={{width: '13.2%'}}><h4>项目名称</h4></Col>
                    <Col style={{width: '7.9%'}}><h4>环境</h4></Col>
                    <Col style={{width: '15.1%'}}><h4>ip</h4></Col>
                    <Col style={{width: '8.7%'}}><h4>发布时间</h4></Col>
                    <Col style={{width: '17.2%'}}><h4>服务器运行版本</h4></Col>
                    <Col style={{width: '16.9%'}}><h4>发布版本</h4></Col>
                    <Col style={{width: '18%'}}><h4>操作</h4></Col>
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
                            <Col style={{width: '3%'}}>{project.id}</Col>
                            <Col style={{width: '13.2%'}}>{project.name}</Col>
                            <Col style={{width: '65.8%'}}>
                                {
                                    project.projectEnvConfigList && project.projectEnvConfigList.map((projectEnvConfig, projectEnvIndex) => {
                                        return (
                                            <Row type="flex" align="middle"
                                                 key={`projectEnvConfigList_${projectEnvIndex}`}
                                                 style={{
                                                     paddingBottom: '10px',
                                                     paddingTop: '10px',
                                                     borderBottom: project.projectEnvConfigList && project.projectEnvConfigList.length - 1 === projectEnvIndex ? '' : '1px solid #e9e9e9'

                                                 }}>
                                                <Col style={{width: '12.5%'}}>{projectEnvConfig.envName}</Col>
                                                <Col style={{width: '82.5%'}}>
                                                    {
                                                        projectEnvConfig.projectEnvIpList && projectEnvConfig.projectEnvIpList.map((projectEnvIp, projectEnvIpIndex) => {
                                                            return <Row type="flex" align="middle"
                                                                        key={`ipList_${projectEnvIpIndex}`}>
                                                                <Col style={{
                                                                    width: '26.5%',
                                                                    paddingBottom: '10px',
                                                                    paddingTop: '10px'
                                                                }}>{projectEnvIp.serverIp ? `${projectEnvIp.serverName}_${projectEnvIp.serverIp}` : ''}</Col>
                                                                <Col
                                                                    style={{width: '15%'}}>{projectEnvIp.publishTime}</Col>

                                                                <Col
                                                                    style={{
                                                                        width: '30%',
                                                                        wordWrap: 'break-word'
                                                                    }}>{projectEnvIp.publishVersion}</Col>
                                                                <Col style={{width: '23.5%'}}>
                                                                    {
                                                                        projectEnvIp.serverIp ?
                                                                            projectEnvIp.publish ?

                                                                                projectEnvIp.buildStatus === 'PROCESSING' ? '构建中...' :

                                                                                    projectEnvConfig.selectBranch ?
                                                                                        <Dropdown overlay={<Menu
                                                                                            onClick={(e) => {
                                                                                                dispatch({
                                                                                                    type: 'projectModel/structure',
                                                                                                    payload: {
                                                                                                        id: projectEnvIp.projectId,
                                                                                                        envId: projectEnvIp.envId,
                                                                                                        serverMachineIp: projectEnvIp.serverIp,
                                                                                                        publishBranch: e.item.props.children
                                                                                                    }
                                                                                                });
                                                                                            }}>
                                                                                            {
                                                                                                project.branchList && JSON.parse(project.branchList).map((item, branchListIndex) => {
                                                                                                    return <Menu.Item
                                                                                                        key={`${project.id}_${branchListIndex}`}>{item}</Menu.Item>;
                                                                                                })
                                                                                            }</Menu>}
                                                                                                  trigger={['hover']}>
                                                                                            <Button size="small"
                                                                                                    type="primary">
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
                                                                                                            envId: projectEnvIp.envId,
                                                                                                            serverMachineIp: projectEnvIp.serverIp,
                                                                                                        }
                                                                                                    });
                                                                                                }}>发布</Button>
                                                                                :
                                                                                <div>
                                                                                    {!projectEnvConfig.syncServerMachineId ?
                                                                                        <Button
                                                                                            style={{marginRight: '10px'}}
                                                                                            type="danger"
                                                                                            size="small"
                                                                                            onClick={() => {
                                                                                                dispatch({
                                                                                                    type: 'projectModel/sync',
                                                                                                    payload: {
                                                                                                        id: projectEnvIp.projectId,
                                                                                                        envId: projectEnvIp.envId,
                                                                                                        serverMachineIp: projectEnvIp.serverIp,
                                                                                                    }
                                                                                                });
                                                                                            }}>从本地同步</Button> :
                                                                                        <Tooltip placement="topRight"
                                                                                                 title={`从 ${projectEnvConfig.syncServerMachineName}-${projectEnvConfig.syncServerMachineIp} 服务器同步`}>
                                                                                            <Button type="danger"
                                                                                                    size="small"
                                                                                                    onClick={() => {
                                                                                                        dispatch({
                                                                                                            type: 'projectModel/serverSync',
                                                                                                            payload: {
                                                                                                                id: projectEnvIp.projectId,
                                                                                                                envId: projectEnvIp.envId,
                                                                                                                serverMachineIp: projectEnvIp.serverIp,
                                                                                                            }
                                                                                                        });
                                                                                                    }}>从服务器同步{projectEnvConfig.eurekaEnable}</Button>
                                                                                        </Tooltip>
                                                                                    }
                                                                                </div>
                                                                            : ''
                                                                    }
                                                                </Col>
                                                            </Row>;
                                                        })
                                                    }
                                                </Col>
                                                <Col style={{width: '5%'}}>
                                                    {
                                                        projectEnvConfig.eurekaEnable ?
                                                            <Link onClick={() => {
                                                                dispatch({
                                                                    type: 'projectModel/eurekaModalVisible',
                                                                    payload: {
                                                                        visible: true,
                                                                        eurekaAppName: project.name
                                                                    }
                                                                });
                                                            }}>Eureka</Link> : ''
                                                    }
                                                </Col>
                                            </Row>
                                        );
                                    })
                                }
                            </Col>
                            <Col style={{width: '18%', textAlign: 'center'}}>
                                <p><Link to={route.projectBuildLogPath(project.id)}
                                         target="_blank">查看日志</Link></p>
                                <p><Link to={route.projectEditPath(project.id)}>编辑</Link></p>

                                <p><Link onClick={() => {
                                    dispatch({
                                        type: 'projectModel/branchRefresh',
                                        payload: {
                                            id: project.id,
                                            query: location.query
                                        }
                                    });
                                }}>刷新分支</Link></p>
                                <p><Popconfirm title="确定删除此项目吗？" onConfirm={() => {
                                    dispatch({
                                        type: 'projectModel/deleted',
                                        payload: {
                                            id: project.id,

                                        }
                                    });
                                }} okText="Yes" cancelText="No">
                                    <Link>删除</Link>
                                </Popconfirm></p>
                                <p><Popconfirm title="确定初始化此项目吗？" onConfirm={() => {
                                    dispatch({
                                        type: 'projectModel/initGit',
                                        payload: {
                                            id: project.id
                                        }
                                    });
                                }} okText="Yes" cancelText="No">
                                    <Link>初始化</Link>
                                </Popconfirm>
                                </p>
                            </Col>
                        </Row>);
                })
            }

            <Modal
                title={eureka.application.name}
                visible={eureka.modalVisible}
                footer={null}
                width={'80%'}
                onCancel={() => {
                    dispatch({
                        type: 'projectModel/eurekaModalVisible',
                        payload: {
                            visible: false
                        }
                    });
                }}
            >
                <Table
                    pagination={false}
                    columns={[{
                        title: 'ip地址',
                        dataIndex: 'hostName',
                        key: 'hostName',
                    }, {
                        title: '项目名称',
                        dataIndex: 'instanceId',
                        key: 'instanceId',
                    }, {
                        title: 'Eureka状态',
                        dataIndex: 'status',
                        key: 'status',
                    }, {
                        title: 'Action',
                        key: 'action',
                        render: (text, record) => (
                            <p>
                                {
                                    record.status === 'OUT_OF_SERVICE' ?
                                        <Button type="primary" onClick={() => {
                                            dispatch({
                                                type: 'projectModel/eurekaAppStatus',
                                                payload: {
                                                    value: 'UP',
                                                    instanceId: record.instanceId,
                                                    app: record.app
                                                }
                                            });
                                        }}>上线</Button> :
                                        <Button type="danger" onClick={() => {
                                            dispatch({
                                                type: 'projectModel/eurekaAppStatus',
                                                payload: {
                                                    value: 'OUT_OF_SERVICE',
                                                    instanceId: record.instanceId,
                                                    app: record.app
                                                }
                                            });
                                        }}>下线</Button>
                                }

                            </p>
                        ),
                    }]}
                    dataSource={eureka.application.instance}/>
            </Modal>
        </div>
    )
        ;
}

ProjectRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult, tagList, eureka} = state.projectModel;
    return {pageResult, tagList, eureka};
}

export default connect(mapStateToProps)(ProjectRoute);
