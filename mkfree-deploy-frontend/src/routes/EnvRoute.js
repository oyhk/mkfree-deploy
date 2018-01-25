import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function EnvRoute({dispatch, location, pageResult}) {
    const columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },{
        title: '排序号',
        dataIndex: 'sort',
        key: 'sort',
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
            return <div><Link to={route.envEditPath(record.id)}>编辑</Link> &nbsp;&nbsp;</div>;
        }
    }];
    return (
        <div>
            <Row type="flex" justify="end"
                 style={{paddingBottom: '20px', paddingTop: '20px', backgroundColor: '#ffffff'}}>
                <Button type="primary"
                        onClick={() => {
                            browserHistory.push(route.envAdd.url);
                        }}
                >添加</Button>
            </Row>
            <Table dataSource={pageResult.list}
                   columns={columns}
                   pagination={{
                       defaultPageSize: 100,
                       current: pageResult.pageNo + 1,
                       defaultCurrent: pageResult.pageNo + 1,
                       total: pageResult.totalCount,
                       onChange: (page, pageSize) => {
                           browserHistory.push(`${route.env.url}?pageNo=${page}&pageSize=${pageSize}`);
                       }
                   }}/>
        </div>
    );
}

EnvRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.EnvModel;
    return {pageResult};
}

export default connect(mapStateToProps)(EnvRoute);
