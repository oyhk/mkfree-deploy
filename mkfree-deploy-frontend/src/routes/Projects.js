import React, {Component} from "react";
import {connect} from "dva";
import {Table, notification, Button, Checkbox, Modal} from "antd";
import {browserHistory, routerRedux} from "dva/router";
import styles from "./Projects.css";
import {
    PAGE_SIZE,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECT_STRUCTURE_LOGS,
    ENV_DEV,
    ENV_TEST,
    ENV_UAT,
    ENV_PROD
} from "../constants";

const ENV = {
    DEV: ENV_DEV,
    TEST: ENV_TEST,
    UAT: ENV_UAT,
    PROD: ENV_PROD
}

const CheckboxGroup = Checkbox.Group;

function Projects({dispatch, list: dataSource, loading, total, pageNo: current, visible_more, recordID, envType, serverMachineList, location}) {
    const {pathname}=location;
    
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
        values.pathname = pathname;
        dispatch({
            type: 'projects/deploy',
            payload: values,
        });
    }
    
    function changeState(obj) {
        dispatch({
            type: 'projects/Info',
            payload: obj,
        });
    }
    
    function NotificationWindow(type, message, description) {
        notification[type]({
            message,
            description,
        });
    }
    
    const
        columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    <a
                        onClick={() => {
                            changeState({
                                projectEnvConfigList: record.projectEnvConfigList
                            })
                            browserHistory.push(`${ROUTE_PROJECT_STRUCTURE_LOGS }/${text}/${record.id }`)
                        }}
                    >{text}</a>,
            },
            // ${LOGS_LIST}
            {
                title: '发布',
                dataIndex: 'projectEnvConfigList',
                key: 'projectEnvConfigList',
                render: (text, record) => {
                    let em = (record.projectEnvConfigList || []).map((item, index) => {
                        let change = (env) => {
                            changeState({
                                visible_more: true,
                                recordID: record.id,
                                envType: env,
                                serverMachineList: item.serverMachineList.map((item, index) => {
                                    return {
                                        value: item.id.toString(),
                                        label: item.name,
                                    }
                                }),
                            });
                        }
                        return <a
                            key={index}
                            onClick={() => {
                                changeState({
                                    projectEnvConfigList: record.projectEnvConfigList,
                                    nextName: `${ROUTE_PROJECT_STRUCTURE_LOGS }/${record.name}/${record.id }`
                                })
                                if (item.serverMachineList.length > 1) {
                                    change(ENV[item.env])
                                } else {
                                    deploy({
                                        id: record.id,
                                        env: ENV[item.env][0]
                                    })
                                }
                                
                            }}>
                            {ENV[item.env][1]}
                        </a>
                        
                    });
                    return (<div className={styles.operation}>{  em  }</div>);
                },
                
            },
            {
                title: '最近发布时间',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                render: (text, record) => (
                    <span>{text}</span>
                )
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
                {visible_more ?
                    <Modal_more
                        visible_more={visible_more}
                        envType={envType}
                        recordID={recordID}
                        changeState={changeState}
                        serverMachineList={serverMachineList}
                        deploy={deploy}
                        NotificationWindow={NotificationWindow}
                    />
                    : null}
            </div>
        </div>
    );
}
class Modal_more extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverMachineIdList: [],
            indeterminate: false,
            checkAll: false,
        }
    }
    
    render() {
        const
            {serverMachineIdList, indeterminate, checkAll} = this.state,
            {visible_more, recordID, envType, changeState, serverMachineList, deploy, NotificationWindow} = this.props;
        return (
            <div>
                <Modal
                    title={"选中发布服务器:" + envType[1]}
                    visible={visible_more}
                    width={440}
                    okText="发布"
                    onCancel={changeState.bind(null, {visible_more: false, serverMachineIdList: []})}
                    onOk={() => {
                        if (serverMachineIdList.length > 0) {
                            deploy({
                                id: recordID,
                                env: envType[0],
                                serverMachineIdList
                            })
                            changeState({visible_more: false});
                        } else {
                            NotificationWindow("warning", "", "请选中一个服务器再进行发布！")
                            return false;
                        }
                    }}
                >
                    <div>
                        <div style={{borderBottom: '1px solid #E9E9E9'}}>
                            <Checkbox
                                indeterminate={indeterminate}
                                checked={checkAll}
                                onChange={(e) => {
                                    this.setState({
                                        serverMachineIdList: e.target.checked ? serverMachineList.map((item) => {
                                                return item.value
                                            }) : [],
                                        indeterminate: false,
                                        checkAll: e.target.checked,
                                    });
                                }}
                            >
                                Check all
                            </Checkbox>
                        </div>
                        <br/>
                        <CheckboxGroup
                            className={styles.antCheckbox}
                            options={serverMachineList}
                            value={serverMachineIdList}
                            onChange={(serverMachineIdList) => {
                                this.setState({
                                    serverMachineIdList,
                                    indeterminate: !!serverMachineIdList.length && (serverMachineIdList.length < serverMachineList.length),
                                    checkAll: serverMachineIdList.length === serverMachineList.length,
                                });
                                //changeState({serverMachineIdList:checkedList})
                            }}
                        />
                    
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const {list, total, pageNo, visible_more, recordID, envType, serverMachineList} = state.projects;
    return {
        loading: state.loading.models.projects,
        list,
        total,
        pageNo,
        visible_more,
        recordID,
        envType,
        serverMachineList,
    };
}

export default connect(mapStateToProps)(Projects);
