import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col} from 'antd';

function ProjectRoute({dispatch, pageResult}) {


    const columns = [{
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '操作',
        dataIndex: 'options',
        key: 'options',
        render: (text, record) => {

            const option = record.projectEnvConfigList.map((projectEnvConfig, projectEnvConfigIndex) => {
                const serverMachineList = projectEnvConfig.serverMachineList.map((serverMachine, serverMachineIndex) => {
                    return <li key={serverMachineIndex}>
                        <span style={{paddingRight: '5px'}}>{serverMachine.ip}</span>
                        { serverMachineIndex === 0 ?
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
    }];
    return (
        <div>
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
