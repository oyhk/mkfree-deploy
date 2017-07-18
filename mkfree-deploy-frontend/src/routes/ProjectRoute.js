import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col} from 'antd';
import {route} from '../Constant';

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
                const serverMachineList = projectEnvConfig.serverMachineList.map((serverMachine, serverMachineIndex) => {
                    return <li key={serverMachineIndex} style={{marginTop: '5px'}}>
                        <span style={{paddingRight: '5px'}}>{serverMachine.ip}</span>
                        { true ?
                            <Button type="primary"
                                    size="small"
                                    onClick={() => {
                                        dispatch({
                                            type: 'projectModel/structure',
                                            payload: {
                                                id: record.id,
                                                env: projectEnvConfig.env,
                                                serverMachineIp: serverMachine.ip,
                                            }
                                        });
                                    }}>发布</Button>
                            :
                            <Button type="danger"
                                    size="small"
                                    onClick={() => {

                                    }}>同步</Button>
                        }
                    </li>;
                });
                return (
                    <Row key={projectEnvConfigIndex} type="flex" style={{paddingTop: '10px'}}>
                        <Col span={3}>{projectEnvConfig.envText} :</Col>
                        <Col span={21}>
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
            <Table dataSource={pageResult.list} columns={columns}/>
        </div>
    );
}

ProjectRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.projectModel;
    return {pageResult};
}

export default connect(mapStateToProps)(ProjectRoute);
