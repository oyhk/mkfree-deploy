import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button, message } from 'antd';
import { Link, browserHistory, routerRedux } from 'dva/router';
import styles from './Users.less';
import {
    PAGE_SIZE,
    ROUTE_ADMIN_USERS_INFO,
    ROUTE_ADMIN_USERS_CREATE,
} from '../constants';
import UserModal from '../components/Users/UserModal';

function Users({dispatch, list: dataSource, loading, total, pageNo: current, visible}) {

    let deleteUserLock = false;

    function deleteUser(id) {
        if (!deleteUserLock) {
            deleteUserLock = true;
            dispatch({
                type: `users/userDelete`,
                payload: {
                    id,
                },
                callBack: (result)=> {
                    if (result.code === '1') {
                        message.success('删除成功');
                        dispatch({
                            type: 'users/fetch',
                            payload: {
                                pageNo: 1,
                            }
                        })
                    } else {
                        deleteUserLock = false;
                    }
                }
            });
        } else {
            message.warning('请勿连续点击按钮');
        }
    }


    function pageChangeHandler(pageNo) {
        dispatch(routerRedux.push({
            pathname: '/users',
            query: {pageNo},
        }));
    }

    function editHandler(id, values) {
        dispatch({
            type: 'users/patch',
            payload: {id, values},
        });
    }

    function createHandler(values) {
        dispatch({
            type: 'users/create',
            payload: values,
        });
    }

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            render: text => <a href="">{text}</a>,
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span className={styles.operation}>
          <Link to={`${ROUTE_ADMIN_USERS_INFO}/${record.id}`}>编辑</Link>
          <Popconfirm title="Confirm to delete?" onConfirm={()=> deleteUser(record.id)}>
              <a href="">删除</a>
          </Popconfirm>
        </span>
            ),
        },
    ];

    return (
        <div className={styles.normal}>
            <div>
                <div className={styles.create}>
                    <Button type="primary" onClick={()=> browserHistory.push(ROUTE_ADMIN_USERS_CREATE)}>创建用户</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={record => record.id}
                    pagination={false}
                />
                <Pagination
                    className="ant-table-pagination"
                    total={total}
                    current={current+1}
                    pageSize={PAGE_SIZE}
                    onChange={pageChangeHandler}
                />
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const {list, total, pageNo, visible} = state.users;
    return {
        loading: state.loading.models.users,
        list,
        total,
        pageNo,
        visible,
    };
}

export default connect(mapStateToProps)(Users);
