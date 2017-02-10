import React, {Component} from 'react';
import {connect} from 'dva';
import {Input, Form, Icon, Button, Transfer} from 'antd';
import {routerRedux} from 'dva/router';

import styles from './Projects.css';

import {PAGE_SIZE, ROUTE_PROJECTS, ENV_DEV, ENV_UAT, ENV_PROD} from '../constants';

const FormItem = Form.Item;

function ProjectsCreate({dispatch, list: dataInfo, sList: servarData, loading, total, pageNo: current}) {

    console.log(dataInfo)
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

    return (
        <div>
            <ProjectsCentont record={dataInfo} servarData={servarData} onOk={saveHandler}/>
        </div>
    );
}


class ProjectsCentont extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,

            DEVConfig: {
                "env": "DEV",
                "serverMachineIdList": [], /*选中服务器列表*/
                "publicBranch": "", /*分支名*/
                "structureBeforeList": [""], /*发布前命令*/
                "structureAfterList": [""], /*发布后命令*/
            },

            TESTConfig: {
                "env": "DEV",
                "serverMachineIdList": [],
                "publicBranch": "",
                "structureBeforeList": [""],
                "structureAfterList": [""],
            },

            UATConfig: {
                "env": "DEV",
                "serverMachineIdList": [],
                "publicBranch": "",
                "structureBeforeList": [""],
                "structureAfterList": [""],
            },

            PRODConfig: {
                "env": "DEV",
                "serverMachineIdList": [],
                "publicBranch": "",
                "structureBeforeList": [""],
                "structureAfterList": [""],
            },


        };
    }

    componentDidMount() {
        if (this.props.record && this.props.record.projectEnvConfigList) {
            this.setState({
                DEVConfig: this.props.record.projectEnvConfigList[0],
                TESTConfig: this.props.record.projectEnvConfigList[1],
                UATConfig: this.props.record.projectEnvConfigList[2],
                PRODConfig: this.props.record.projectEnvConfigList[3],
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record && this.props.record.projectEnvConfigList && this.state.visible) {
            this.setState({
                DEVConfig: this.props.record.projectEnvConfigList[0],
                TESTConfig: this.props.record.projectEnvConfigList[1],
                UATConfig: this.props.record.projectEnvConfigList[2],
                PRODConfig: this.props.record.projectEnvConfigList[3],
                visible: false
            })
        }
        console.log(this.state)
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = (e) => {
        e.preventDefault();
        const {onOk} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["projectEnvConfigList"] = [
                    this.state.DEVConfig,
                    this.state.TESTConfig,
                    this.state.UATConfig,
                    this.state.PRODConfig,
                ]
                // const projectEnvConfigList= [];
                onOk(values);
                console.log(values)
            }
        });
    };
    onSubmitAll = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {

                // onOk(values);
                // this.hideModelHandler();
                console.log(values)
                return;
            }
        });
    }
    revampList = (env, after, index, type, value) => {
        const Build = JSON.parse(JSON.stringify(this.state[env]));

        (type == "add" ) && (Build[after].push(""));

        (type == "delete" && Build[after].length > 1) && (Build[after].splice(index, 1));

        (type == "revamp" && index > -1) && (Build[after][index] = value);

        (type == "revamp" && index == -1) && (Build[after] = value);

        this.setState({[env]: Build});
    }

    render() {
        const {children} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {name, gitUrl, publishBranch, remotePath, moduleName, deployTargetFile} = this.props.record;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 8},
        };
        console.log(this.props.record)
        const
            _state = this.state,
            mockData = [],
            DEVTargetKeys = _state.DEVConfig.serverMachineIdList,
            TESTTargetKeys = _state.TESTConfig.serverMachineIdList,
            UATTargetKeys = _state.UATConfig.serverMachineIdList,
            PRODTargetKeys = _state.PRODConfig.serverMachineIdList,
            DEVStructureB = _state.DEVConfig.structureBeforeList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("DEVConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("DEVConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
            }),
            DEVStructureA = _state.DEVConfig.structureAfterList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("DEVConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("DEVConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>
            }),
            TESTStructureB = _state.TESTConfig.structureBeforeList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("TESTConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("TESTConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
            }),
            TESTStructureA = _state.TESTConfig.structureAfterList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("TESTConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("TESTConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>
            }),
            UATStructureB = _state.UATConfig.structureBeforeList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("UATConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("UATConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
            }),
            UATStructureA = _state.UATConfig.structureAfterList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("UATConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("UATConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>;
            }),
            PRODStructureB = _state.PRODConfig.structureBeforeList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("PRODConfig", "structureBeforeList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("PRODConfig", "structureBeforeList", index, "delete", e)
                    }}/>
                }/></div>;
            }),
            PRODStructureA = _state.PRODConfig.structureAfterList.map((item, index) => {
                return <div key={index}><Input value={item} onChange={(e) => {
                    this.revampList("PRODConfig", "structureAfterList", index, "revamp", e.target.value)
                }} addonAfter={
                    <Icon style={{cursor: "pointer"}} type="minus" onClick={(e) => {
                        this.revampList("PRODConfig", "structureAfterList", index, "delete", e)
                    }}/>
                }/></div>;


            });

        if (this.props.servarData.length > 0) {
            this.props.servarData.map((item, index)=> {
                mockData.push({
                    key: item.id,
                    title: item.name,
                    description: index,
                });
            });
        }


        return (
            <div className={styles.projectsCenton}>
                <Form horizontal onSubmit={this.okHandler}>
                    <div>
                        <h3>基本配置</h3>
                        <FormItem
                            {...formItemLayout}
                            label="名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: name,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="仓库url"
                        >
                            {
                                getFieldDecorator('gitUrl', {
                                    initialValue: gitUrl,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="远程机器项目根路径"
                        >
                            {
                                getFieldDecorator('remotePath', {
                                    initialValue: remotePath,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部署的项目模块名称"
                        >
                            {
                                getFieldDecorator('moduleName', {
                                    initialValue: moduleName,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部署的项目模块文件或者目录"
                        >
                            {
                                getFieldDecorator('deployTargetFile', {
                                    initialValue: deployTargetFile,
                                })(<Input />)
                            }
                        </FormItem>
                    </div>
                    <div className={styles.seaverMachine}>
                        <h3>发布服务器列表</h3>
                        <div className={styles.seaverList}>
                            <div>
                                <h4>开发</h4>
                                <div className={styles.list}>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>服务器列表：</label></div>
                                        <div className="ant-col-18">
                                            <Transfer
                                                dataSource={mockData}
                                                titles={['Source', 'Target']}
                                                targetKeys={DEVTargetKeys}
                                                selectedKeys={_state.selectedKeys}
                                                onChange={(nextTargetKeys)=> {
                                                    this.revampList("DEVConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                                                render={item => item.title}
                                            />
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>发布分支名：</label></div>
                                        <div className="ant-col-16">
                                            <Input
                                                onChange={(e)=>this.revampList("DEVConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建前命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {DEVStructureB}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("DEVConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建后命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {DEVStructureA}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("DEVConfig", "structureAfterList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4>测试</h4>
                                <div className={styles.list}>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>服务器列表：</label></div>
                                        <div className="ant-col-18">
                                            <Transfer
                                                dataSource={mockData}
                                                titles={['Source', 'Target']}
                                                targetKeys={TESTTargetKeys}
                                                selectedKeys={_state.selectedKeys}
                                                onChange={(nextTargetKeys)=> {
                                                    this.revampList("TESTConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                                                render={item => item.title}
                                            />
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>发布分支名：</label></div>
                                        <div className="ant-col-16">
                                            <Input
                                                onChange={(e)=>this.revampList("TESTConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建前命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {TESTStructureB}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("TESTConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建后命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {TESTStructureA}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("TESTConfig", "structureAfterList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.seaverList}>
                            <div>
                                <h4>仿真测试</h4>
                                <div className={styles.list}>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>服务器列表：</label></div>
                                        <div className="ant-col-18">
                                            <Transfer
                                                dataSource={mockData}
                                                titles={['Source', 'Target']}
                                                targetKeys={UATTargetKeys}
                                                selectedKeys={_state.selectedKeys}
                                                onChange={(nextTargetKeys)=> {
                                                    this.revampList("UATConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                                                render={item => item.title}
                                            />
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>发布分支名：</label></div>
                                        <div className="ant-col-16">
                                            <Input
                                                onChange={(e)=>this.revampList("UATConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建前命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {UATStructureB}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("UATConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建后命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {UATStructureA}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("UATConfig", "structureAfterList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4>生产</h4>
                                <div className={styles.list}>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>服务器列表：</label></div>
                                        <div className="ant-col-18">
                                            <Transfer
                                                dataSource={mockData}
                                                titles={['Source', 'Target']}
                                                targetKeys={PRODTargetKeys}
                                                selectedKeys={_state.selectedKeys}
                                                onChange={(nextTargetKeys)=> {
                                                    this.revampList("PRODConfig", "serverMachineIdList", -1, "revamp", nextTargetKeys);
                                                }}
                                                render={item => item.title}
                                            />
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>发布分支名：</label></div>
                                        <div className="ant-col-16">
                                            <Input
                                                onChange={(e)=>this.revampList("PRODConfig", "publicBranch", -1, "revamp", e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建前命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {PRODStructureB}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("PRODConfig", "structureBeforeList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                    <div className="ant-row">
                                        <div className="ant-col-6"><label>构建后命令：</label></div>
                                        <div className={`ant-col-16 ${styles.addMore}`}>
                                            {PRODStructureA}
                                        </div>
                                        <div className="ant-col-2" style={{textAlign: "center"}}>
                                            <a style={{lineHeight: "28px"}}><Icon type="plus-circle-o" onClick={() => {
                                                this.revampList("PRODConfig", "structureAfterList", 0, "add", "")
                                            }}/></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{paddingLeft: 430, marginBottom: 20}}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {list, sList, total, pageNo} = state.projectsCreate;
    return {
        loading: state.loading.models.projectsCreate,
        list,
        sList,
        total,
        pageNo,
    };
}

ProjectsCentont = Form.create()(ProjectsCentont);
export default connect(mapStateToProps)(ProjectsCreate);
