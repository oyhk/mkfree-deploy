import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {Link, browserHistory ,routerRedux} from 'dva/router';
import styles from './Projects.css';
import {PAGE_SIZE, ROUTE_PROJECTS, ROUTE_PROJECTS_CREATE, ROUTE_PROJECTS_INFO, ENV_DEV, ENV_TEST, ENV_UAT, ENV_PROD} from '../constants';
import ProjectModal from '../components/Projects/ProjectModal';


function StructureLogs({dispatch, list: dataSource, loading, total, pageNo: current}) {


    function deleteHandler(id) {
        dispatch({
            type: 'projects/remove',
            payload: id,
        });
    }

    function pageChangeHandler(pageNo) {
        dispatch(routerRedux.push({
            pathname: '/projects',
            query: {pageNo},
        }));
    }

    function editHandler(id, values) {
        values.id = id;
        dispatch({
            type: 'projects/patch',
            payload: values,
        });
    }

    function saveHandler(values) {
        dispatch({
            type: 'projects/create',
            payload: values,
        });
    }

    function deploy(values) {
        dispatch({
            type: 'projects/deploy',
            payload: values,
        });
    }

    const columns = [
        {
            title: '发布ID',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href={`${ROUTE_PROJECT_STRUCTURE_LOGS_INFO}/${record.id}`}>{text}</a>,
        },
        {
            title: '发布时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }
    ];
    return (
        <div className={styles.normal}>
            <div>
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
    const {list, total, pageNo} = state.project_log_lists;
    return {
        loading: state.loading.models.project_log_lists,
        list,
        total,
        pageNo,
    };
}

export default connect(mapStateToProps)(StructureLogs);
