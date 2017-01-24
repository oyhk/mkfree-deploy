import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './Projects.css';
import {PAGE_SIZE, ROUTE_PROJECTS} from '../constants';
import ProjectModal from '../components/Projects/ProjectModal';


function Projects({dispatch, list: dataSource, loading, total, pageNo: current}) {


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

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="">{text}</a>,
        },
        {
            title: '发布',
            dataIndex:'',
            key:'',
            render: (text,record)=>(
                <span className={styles.operation}>
                    <a>开发</a>
                    <a>预发布</a>
                    <a>生产</a>
                </span>
            )
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span className={styles.operation}>
                    <ProjectModal record={record} onOk={editHandler.bind(null, record.id)}>
                        <a>编辑</a>
                    </ProjectModal>
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
                    <ProjectModal title="新建项目" record={{}} onOk={saveHandler}>
                        <Button type="primary">创建项目</Button>
                    </ProjectModal>
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
    const {list, total, pageNo} = state.projects;
    return {
        loading: state.loading.models.projects,
        list,
        total,
        pageNo,
    };
}

export default connect(mapStateToProps)(Projects);
