import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button,Checkbox , Modal} from 'antd';
import {Link, browserHistory ,routerRedux} from 'dva/router';
import styles from './Projects.css';
import {PAGE_SIZE, ROUTE_PROJECTS, ROUTE_PROJECTS_CREATE, ROUTE_PROJECTS_INFO, ENV_DEV, ENV_TEST, ENV_UAT, ENV_PROD ,ROUTE_PROJECT_STRUCTURE_LOGS} from '../constants';

const CheckboxGroup = Checkbox.Group;

function Projects({dispatch, list: dataSource, loading, total, pageNo: current, visible_more, recordID, envType, serverMachineList, serverMachineIdList}) {

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
        console.log(values)
        // changeState({serverMachineIdList:[]})
        //
        dispatch({
            type: 'projects/deploy',
            payload: values,
        });
    }
    function  changeState(obj) {
        dispatch({
            type: 'projects/Info',
            payload: obj,
        });
    }
    const
        columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                render: (text,record) => <a href={ROUTE_PROJECT_STRUCTURE_LOGS +"/"+ record.id}>{text}</a>,
            },
            {
                title: '发布',
                dataIndex: 'projectEnvConfigList',
                key: 'projectEnvConfigList',
                render: (text, record)=>{
                    let em = (record.projectEnvConfigList||[]).map((item,index)=>{
                        let change= (env)=>{
                            changeState({
                                visible_more:true,
                                recordID:record.id,
                                envType:env,
                                serverMachineList:item.serverMachineList.map((item,index)=>{
                                    return {
                                        value: item.id.toString(),
                                        label: item.name,
                                    }
                                }),
                            });
                        }
                        switch (item.env){
                            case  "DEV" :
                                if((item.serverMachineList || []).length>1) {
                                    return <a key={index} onClick={() => {
                                        change(ENV_DEV);
                                    }}>{ENV_DEV[1]}123</a>;
                                }
                                return <a key={index} onClick={deploy.bind(null, {id: record.id, env: ENV_DEV[0]})}>{ENV_DEV[1]}</a>;
                            case  "TEST" :
                                if((item.serverMachineList || []).length>1) {
                                    return <a key={index} onClick={() => {
                                        change(ENV_TEST);
                                    }}>{ENV_TEST[1]}123</a>;
                                }
                                return <a key={index} onClick={deploy.bind(null, {id: record.id, env: ENV_TEST[0]})}>{ENV_TEST[1]}</a>;
                            case  "UAT" :
                                if((item.serverMachineList || []).length>1) {
                                    return <a key={index} onClick={() => {
                                        change(ENV_UAT);
                                    }}>{ENV_UAT[1]}123</a>;
                                }
                                return <a key={index} onClick={deploy.bind(null, {id: record.id, env: ENV_UAT[0]})}>{ENV_UAT[1]}</a>;
                            case  "PROD" :
                                if((item.serverMachineList || []).length>1) {
                                    return <a key={index} onClick={() => {
                                        change(ENV_PROD);
                                    }}>{ENV_PROD[1]}123</a>;
                                }
                                return <a key={index} onClick={deploy.bind(null, {id: record.id, env: ENV_PROD[0]})}>{ENV_PROD[1]}</a>;
                        }
                    });
                    return (
                        <div className={styles.operation}>
                            {  em  }
                        </div>);

                },

            },
            {
                title: '最近发布时间',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                render: (text, record)=>(
                    <span>{text}</span>
                )
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
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
    console.log("Modal",visible_more, recordID, envType, serverMachineList ,serverMachineIdList)
    return (
        <div className={styles.normal}>
            <div>
                <div className={styles.create}>
                    <Button type="primary" onClick={()=> browserHistory.push(`${ROUTE_PROJECTS_CREATE}`)}>创建项目</Button>
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
                        className : "ant-table-pagination",
                        total : total,
                        current : current+1,
                        pageSize : PAGE_SIZE,
                        showTotal :total => `共 ${total} 条`,
                        onChange : pageChangeHandler,
                    }}
                />
                {visible_more?
                <Modal
                    title={"选中发布服务器:" + envType[1]}
                    visible={visible_more}
                    width={440}
                    okText="发布"
                    onCancel={changeState.bind(null,{visible_more:false,serverMachineIdList:[]})}
                    onOk={()=>{
                        if(serverMachineIdList.length >0){
                            deploy({
                                id: recordID,
                                env: envType[0],
                                serverMachineIdList
                            })
                            changeState({visible_more:false});
                        }else{
                            return false;
                        }
                    }}
                >
                    <div>
                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                            <Checkbox
                                indeterminate={false}
                                onChange={(checkedList)=>{
                                    changeState({serverMachineIdList:checkedList})
                                }}
                                checked={serverMachineIdList}
                            >
                                Check all
                            </Checkbox>
                        </div>
                        <br/>
                        <CheckboxGroup
                            className={styles.antCheckbox}
                            options={serverMachineList}
                            value={serverMachineIdList}
                            onChange={(checkedList)=>{
                                changeState({serverMachineIdList:checkedList})
                            }}
                        />

                    </div>
                </Modal>
                :null}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const {list, total, pageNo ,visible_more, recordID, envType, serverMachineList,serverMachineIdList} = state.projects;
    return {
        loading: state.loading.models.projects,
        list,
        total,
        pageNo,
        visible_more,
        recordID,
        envType,
        serverMachineList,
        serverMachineIdList,
    };
}

export default connect(mapStateToProps)(Projects);
