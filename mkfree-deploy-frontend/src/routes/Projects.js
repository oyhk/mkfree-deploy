import React from "react";
import {connect} from "dva";
import {Table, Popconfirm, Button} from "antd";
import {Link, browserHistory, routerRedux} from "dva/router";
import styles from "./Projects.css";
import {
    PAGE_SIZE,
    ROUTE_JOB,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECTS_INFO,
    ENV_DEV,
    ENV_TEST,
    ENV_UAT,
    ENV_PROD
} from "../constants";


function Projects({dispatch, list: dataSource, loading, total, pageNo: current}) {
    
    
    function deleteHandler(id) {
        dispatch({
            type: 'projects/remove',
            payload: id,
        });
    }
    
    function pageChangeHandler(pageNo) {
        dispatch(routerRedux.push({
            pathname: '/deploy/projects',
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
            render: (text, record) => <a href={ROUTE_JOB + "/" + record.id}>{text}</a>,
        },
        {
            title: '发布',
            dataIndex: 'projectEnvConfigList',
            key: 'projectEnvConfigList',
            render: (text, record) => (
                <span className={styles.operation}>
                    {
                        (record.projectEnvConfigList || []).map((item, index) => {
                            switch (item.env) {
                                case  "DEV" :
                                    return <a
                                        onClick={deploy.bind(null, {id: record.id, env: ENV_DEV[0]})}>{ENV_DEV[1]}</a>;
                                case  "TEST" :
                                    return <a onClick={deploy.bind(null, {
                                        id: record.id,
                                        env: ENV_TEST[0]
                                    })}>{ENV_TEST[1]}</a>;
                                case  "UAT" :
                                    return <a
                                        onClick={deploy.bind(null, {id: record.id, env: ENV_UAT[0]})}>{ENV_UAT[1]}</a>;
                                case  "PROD" :
                                    return <a onClick={deploy.bind(null, {
                                        id: record.id,
                                        env: ENV_PROD[0]
                                    })}>{ENV_PROD[1]}</a>;
                            }
                        })
                    }
                </span>
            )
        },
        {
            title: '最近发布时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text, record) => (
                <span>{text}</span>
            )
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span className={styles.operation}>
                    <Link to={`${ROUTE_PROJECTS_INFO}/${record.id}`}>编辑</Link>
                    {/*<ProjectModal title="编辑项目" record={record} onOk={editHandler.bind(null, record.id)}>*/}
                    {/*<a>编辑</a>*/}
                    {/*</ProjectModal>*/}
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
                    <Button type="primary" onClick={() => browserHistory.push(`${ROUTE_PROJECTS_CREATE}`)}>创建项目</Button>
                    {/*<ProjectModal title="新建项目" record={{}} onOk={saveHandler}>*/}
                    {/*<Button type="primary">创建项目</Button>*/}
                    {/*</ProjectModal>*/}
                </div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey={record => record.id}
                    pagination={{
                        className: "ant-table-pagination",
                        total: total,
                        current: current + 1,
                        pageSize: PAGE_SIZE,
                        showTotal: total => `共 ${total} 条`,
                        onChange: pageChangeHandler,
                    }}
                
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
