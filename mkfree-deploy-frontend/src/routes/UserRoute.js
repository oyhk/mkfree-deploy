import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function UserRoute({dispatch, location, pageResult}) {
    const columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    }, {
        title: '用户角色',
        dataIndex: 'roleTypeText',
        key: 'roleTypeText',
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
            return <div><Link to={route.userEditPath(record.id)}>编辑</Link> &nbsp;&nbsp;</div>;
        }
    }];
    return (
        <Table dataSource={pageResult.list}
               columns={columns}
               pagination={{
                   defaultPageSize: 100,
                   current: pageResult.pageNo + 1,
                   defaultCurrent: pageResult.pageNo + 1,
                   total: pageResult.totalCount,
                   onChange: (page, pageSize) => {
                       browserHistory.push(`${route.user}?pageNo=${page}&pageSize=${pageSize}`);
                   }
               }}/>
    );
}

UserRoute.propTypes = {};

function mapStateToProps(state) {
    const {pageResult} = state.userModel;
    return {pageResult};
}

export default connect(mapStateToProps)(UserRoute);
