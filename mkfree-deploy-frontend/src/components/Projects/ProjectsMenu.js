import React, {Component} from "react";
import {Checkbox, Menu, Icon, notification, Modal} from "antd";
import {Link} from "dva/router";
import {
    ROUTE_PROJECTS,
    ROUTE_PROJECT_STRUCTURE_LOGS,
    ROUTE_PROJECTS_INFO,
    ENV_DEV,
    ENV_TEST,
    ENV_UAT,
    ENV_PROD
} from "../../constants";

const CheckboxGroup = Checkbox.Group;
const ENV = {
    DEV: ENV_DEV,
    TEST: ENV_TEST,
    UAT: ENV_UAT,
    PROD: ENV_PROD
}

function ProjectsMenu({dispatch, location, params, projectEnvConfigList, visible_more, recordID, envType, serverMachineList}) {
    const {project_name, id}=params
    const {pathname}=location;
    
    function changeState(obj) {
        dispatch({
            type: 'projects/Info',
            payload: obj,
        });
    }
    
    function deploy(values) {
        values.pathname = pathname;
        dispatch({
            type: 'projects/deploy',
            payload: values,
        });
        
    }
    
    function NotificationWindow(type, message, description) {
        notification[type]({
            message,
            description,
        });
    }
    
    return (
        <Menu
            selectedKeys={[location.pathname]}
            mode="inline "
            theme="light"
        >
            <Menu.Item key={ROUTE_PROJECTS}>
                <Link to={ROUTE_PROJECTS}><Icon type="rollback"/>返回项目面板</Link>
            </Menu.Item>
            <Menu.Item key={`${ROUTE_PROJECT_STRUCTURE_LOGS }/${project_name }/${id }/${ROUTE_PROJECTS_INFO}`}>
                <Link
                    to={`${ROUTE_PROJECT_STRUCTURE_LOGS }/${project_name }/${id }/${ROUTE_PROJECTS_INFO}`}>
                    <Icon type="edit"/>
                    编辑
                </Link>
            </Menu.Item>
            <Menu.Item key={'33'}>
                <Link ><Icon type="folder-open"/>工作空间</Link>
            </Menu.Item>
            {(projectEnvConfigList || []).map((item, index) => {
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
                
                
                return <Menu.Item key={index}>
                    <a onClick={() => {
                        if (item.serverMachineList.length > 1) {
                            change(ENV[item.env])
                        } else {
                            deploy({
                                id,
                                env: ENV[item.env][0]
                            })
                        }
                    }}>
                        <Icon type="bulb"/>{ENV[item.env][1]}
                    </a>
                </Menu.Item>
            })}
            
            {visible_more &&
            <Modal_more
                visible_more={visible_more}
                envType={envType}
                recordID={recordID}
                changeState={changeState}
                serverMachineList={serverMachineList}
                deploy={deploy}
                NotificationWindow={NotificationWindow}
            />}
        </Menu>
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
        )
    }
}


export default ProjectsMenu;
