import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {Link, browserHistory, routerRedux} from 'dva/router';
import styles from './Users.less';
import {PAGE_SIZE, ROUTE_ADMIN_USERS_INFO} from '../constants';
import UserModal from '../components/Users/UserModal';

function Users({dispatch, list: dataSource, loading, total, pageNo: current, visible}) {

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
          <Link to={`${ROUTE_ADMIN_USERS_INFO}/${record.id}`}>编辑</Link>
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
          <Button type="primary" onClick={()=> browserHistory.push(`${ROUTE_ADMIN_USERS_INFO}/create`)}>创建用户</Button>
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
