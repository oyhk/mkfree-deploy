import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './Projects.css';
import {PAGE_SIZE,ROUTE_ServerMachine} from '../constants';
import ProjectModal from '../components/ServerMachine/ServerMachineModal';


function ServerMachine({dispatch, list: dataSource, loading, total, pageNo: current}) {

    function deleteHandler(id) {
        dispatch({
            type: 'server_machine/remove',
            payload: id,
        });
    }

    function pageChangeHandler(pageNo) {
        dispatch(routerRedux.push({
            pathname: '/server_machine',
            query: {pageNo},
        }));
    }

    function editHandler(id, values) {
        values.id = id;
        dispatch({
            type: 'server_machine/patch',
            payload: values,
        });
    }

    function saveHandler(values) {
        dispatch({
            type: 'server_machine/create',
            payload: values,
        });
    }

    function deploy(values) {
        dispatch({
            type: 'server_machine/deploy',
            payload: values,
        });
    }

    const columns = [
        {
            title: '服务器名称',
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
                    <a onClick={deploy.bind(null,{id:record.id,env:'DEV'})}>开发</a>
                    <a onClick={deploy.bind(null,record.id,'UAT')}>预发布</a>
                    <a onClick={deploy.bind(null,record.id,'PROD')}>生产</a>
                </span>
            )
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <span className={styles.operation}>
                    <ProjectModal title="编辑服务器" record={record} onOk={editHandler.bind(null, record.id)}>
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
                    <ProjectModal title="新建服务器" record={{}} onOk={saveHandler}>
                        <Button type="primary">创建服务器</Button>
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
    const {list, total, pageNo} = state.serverMachine;
    return {
        loading: state.loading.models.serverMachine,
        list,
        total,
        pageNo,
    };
}

export default connect(mapStateToProps)(ServerMachine);
