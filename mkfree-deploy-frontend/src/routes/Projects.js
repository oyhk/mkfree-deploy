import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './Projects.css';
import {PAGE_SIZE, ROUTE_PROJECTS,ENV_DEV,ENV_UAT,ENV_PROD} from '../constants';
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

    function deploy(values) {
        dispatch({
            type: 'projects/deploy',
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
                    <a onClick={deploy.bind(null,{id:record.id,env:ENV_DEV})}>开发</a>
                    <a onClick={deploy.bind(null,record.id,ENV_UAT)}>预发布</a>
                    <a onClick={deploy.bind(null,record.id,ENV_PROD)}>生产</a>
                </span>
            )
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span className={styles.operation}>
                    <ProjectModal title="编辑项目" record={record} onOk={editHandler.bind(null, record.id)}>
                        <a>编辑</a>
                    </ProjectModal>
                    <Popconfirm title="确认删除?" onConfirm={deleteHandler.bind(null, record.id)}>
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
