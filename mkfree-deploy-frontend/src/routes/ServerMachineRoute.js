import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function ServerMachineRoute({dispatch, location, pageResult}) {
    const columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '环境',
        dataIndex: 'envName',
        key: 'envName',
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    }, {
        title: 'ip',
        dataIndex: 'ip',
        key: 'ip',
    }, {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    }, {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render: (value, record, columnIndex) => {
            return <div><Link to={route.serverMachineEditPath(record.id)}>编辑</Link> &nbsp;&nbsp;</div>;
        }
    }];
    return (
        <div>
            <Row style={{marginBottom: '20px'}}>
                <Col span={23}></Col>
                <Col span={1}>
                    <Button type="primary"
                            onClick={() => {
                                browserHistory.push(route.serverMachineAdd.url);
                            }}
                    >添加</Button>
                </Col>
            </Row>
            <Table dataSource={pageResult.list}
                   columns={columns}
                   pagination={{
                       defaultPageSize: 100,
                       current: pageResult.pageNo + 1,
                       defaultCurrent: pageResult.pageNo + 1,
                       total: pageResult.totalCount,
                       onChange: (page, pageSize) => {
                           browserHistory.push(`${route.serverMachine}?pageNo=${page}&pageSize=${pageSize}`);
                       }
                   }}/>
        </div>
    );
}

ServerMachineRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.serverMachineModel;
    return {pageResult};
}

export default connect(mapStateToProps)(ServerMachineRoute);
