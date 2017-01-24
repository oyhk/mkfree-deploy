import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './Users.css';
import {PAGE_SIZE} from '../constants';
import UserModal from '../components/Users/UserModal';


function Users({dispatch, list: dataSource, loading, total, pageNo: current}) {


    function deleteHandler(id) {
        dispatch({
            type: 'users/remove',
            payload: id,
        });
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
                  <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
                    <a>编辑</a>
                  </UserModal>
                  <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
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
                    <UserModal record={{}} onOk={createHandler}>
                        <Button type="primary">创建用户</Button>
                    </UserModal>
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
                    current={current}
                    pageSize={PAGE_SIZE}
                    onChange={pageChangeHandler}
                />
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const {list, total, pageNo} = state.users;
    return {
        loading: state.loading.models.users,
        list,
        total,
        pageNo,
    };
}

export default connect(mapStateToProps)(Users);
