import React from 'react';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select, Checkbox, Radio} from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Option = Select.Option;
const FormItem = Form.Item;

function ProjectFormComponent({dispatch, project, deployTargetFileList, projectEnvConfigList, serverMachineList, tagList, form, isAdd}) {

    const {getFieldDecorator, getFieldValue} = form;

    function submit() {


        if (isAdd) {
            project.id = 0;
        }

        const newProject = {
            id: project.id,
            name: getFieldValue('name'),
            gitUrl: getFieldValue('gitUrl'),
            remotePath: getFieldValue('remotePath'),
            moduleName: getFieldValue('moduleName'),
            projectTagId: getFieldValue('projectTagId'),
        };

        const newDeployTargetFileList = [];
        deployTargetFileList.forEach((item, index) => {
            newDeployTargetFileList.push({
                localFilePath: getFieldValue(`localFilePath${index}`),
                remoteFilePath: getFieldValue(`remoteFilePath${index}`),
                enable: getFieldValue(`isEnable${index}`)
            });
        });

        const newProjectEnvConfigList = [];
        projectEnvConfigList.forEach((item, index) => {


                const newBuildBeforeList = [];

                if (!item.buildBeforeList) {
                    item.buildBeforeList = [{}];
                }
                if (!item.buildAfterList) {
                    item.buildAfterList = [{}];
                }
                if (!item.syncAfterList) {
                    item.syncAfterList = [{}];
                }
                item.syncServerMachineId = getFieldValue(`projectEnvConfigSyncServerMachineId_${index}`);
                item.selectBranch = getFieldValue(`projectEnvConfigSelectBranch_${index}`);
                item.buildBeforeList.forEach((beforeItem, buildBeforeListIndex) => {
                    newBuildBeforeList.push({
                        step: getFieldValue(`projectEnvConfig_stepBefore_${index}_${buildBeforeListIndex}`),
                    });
                });

                const newBuildAfterList = [];
                item.buildAfterList.forEach((afterItem, afterIndex) => {
                    newBuildAfterList.push({
                        step: getFieldValue(`projectEnvConfig_stepAfter_${index}_${afterIndex}`),
                    });
                });

                const newsyncAfterList = [];
                item.syncAfterList.forEach((syncItem, syncIndex) => {
                    newsyncAfterList.push({
                        step: getFieldValue(`projectEnvConfig_sync_${index}_${syncIndex}`),
                    });
                });

                const newProjectEnvIpList = [];
                serverMachineList.filter(serverMachine => serverMachine.envId === item.envId).forEach((serverMachine, serverMachineListIndex) => {
                    const serverIpIsCheck = getFieldValue(`projectEnvConfig_projectEnvIp_serverIp_${index}_${serverMachineListIndex}`);
                    if (serverIpIsCheck) {
                        newProjectEnvIpList.push({
                            serverIp: serverMachine.ip,
                            publish: getFieldValue(`projectEnvConfig_projectEnvIp_publish_${index}_${serverMachineListIndex}`),
                        });
                    }
                });

                newProjectEnvConfigList.push({
                    envId: item.envId,
                    syncServerMachineId: item.syncServerMachineId,
                    selectBranch: item.selectBranch,
                    publicBranch: getFieldValue(`projectEnvConfig_publishBranch_${index}`),
                    projectEnvIpList: newProjectEnvIpList,
                    buildBeforeList: newBuildBeforeList,
                    buildAfterList: newBuildAfterList,
                    syncAfterList: newsyncAfterList,
                });
            }
        );

        if (isAdd) {
            dispatch({
                type: 'projectModel/saved',
                payload: {
                    ...newProject,
                    deployTargetFileList: newDeployTargetFileList,
                    projectEnvConfigList: newProjectEnvConfigList
                }
            });
        } else {
            dispatch({
                type: 'projectModel/update',
                payload: {
                    ...newProject,
                    deployTargetFileList: newDeployTargetFileList,
                    projectEnvConfigList: newProjectEnvConfigList
                }
            });
        }
    }


    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 20},
        },
    };
    return (
        <div>
            <div style={{border: '1px solid #e9e9e9', padding: '15px', borderRadius: '10px'}}>
                <h2>基本信息</h2>
                <FormItem {...formItemLayout} label="项目名称">
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true,
                            message: '名称不能为空',
                        }],
                        initialValue: project.name
                    })(
                        <Input placeholder="名称"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="git仓库地址">
                    {getFieldDecorator('gitUrl', {
                        rules: [{
                            required: true,
                            message: 'git仓库地址不能为空',
                        }],
                        initialValue: project.gitUrl
                    })(
                        <Input placeholder="git仓库地址"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="远程机器项目路劲">
                    {getFieldDecorator('remotePath', {
                        rules: [{
                            required: true,
                            message: '远程机器项目路劲不能为空',
                        }],
                        initialValue: project.remotePath
                    })(
                        <Input placeholder="远程机器项目路劲"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="部署的项目模块名称">
                    {getFieldDecorator('moduleName', {
                        initialValue: project.moduleName
                    })(
                        <Input placeholder="部署的项目模块名称"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="所属标签">
                    {getFieldDecorator('projectTagId', {
                        initialValue: project && project.projectTagId
                    })(
                        <RadioGroup onChange={() => {
                        }}>
                            {
                                tagList && tagList.map((tag, tagListIndex) => {
                                    return <RadioButton key={`tagListIndex${tagListIndex}`}
                                                        value={tag.id}>{tag.name}</RadioButton>;
                                })
                            }
                        </RadioGroup>
                    )}
                </FormItem>
            </div>
            <div style={{border: '1px solid #e9e9e9', padding: '15px', borderRadius: '10px', marginTop: '20px'}}>
                <h2>部署文件</h2>
                <FormItem style={{marginTop: '20px'}} wrapperCol={{span: 2, offset: 22}}>
                    <Button onClick={() => {
                        dispatch({type: 'projectModel/addDeployTargetFile'});
                    }}>添加一项</Button>
                </FormItem>
                {
                    deployTargetFileList.filter(item => item !== undefined).map((item, index) => {
                        return <div key={`deploy_div_${index}`}>
                            <Row type="flex" align="middle">
                                <Col span={21}>
                                    <FormItem key={`deploy_${index}_0`} {...formItemLayout}
                                              label={`( ${index + 1} ) 上传文件路劲`}>
                                        {getFieldDecorator(`localFilePath${index}`, {
                                            initialValue: item.localFilePath ? item.localFilePath : ''
                                        })(
                                            <Input placeholder="上传文件路劲"/>
                                        )}
                                    </FormItem>
                                    <FormItem key={`deploy_${index}_1`} {...formItemLayout} label="服务器路劲">
                                        {getFieldDecorator(`remoteFilePath${index}`, {
                                            initialValue: item.remoteFilePath ? item.remoteFilePath : ''
                                        })(
                                            <Input placeholder="服务器路劲"/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        key={`deploy_${index}_2`}
                                        {...formItemLayout}
                                        label="是否启用"
                                    >
                                        {getFieldDecorator(`isEnable${index}`, {
                                            valuePropName: 'checked',
                                            initialValue: item.enable
                                        })(
                                            <Switch />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={3} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Button shape="circle" icon="minus"
                                            onClick={() => {
                                                dispatch({
                                                    type: 'projectModel/deleteDeployTargetFile',
                                                    payload: {uuid: item.uuid}
                                                });
                                            }}
                                    />
                                </Col>
                            </Row>
                        </div>;
                    })
                }
            </div>

            <div style={{border: '1px solid #e9e9e9', padding: '15px', marginTop: '20px', borderRadius: '10px'}}>
                <h2 style={{paddingTop: '20px'}}>环境配置</h2>
                {
                    projectEnvConfigList.map((projectEnvConfig, index) => {
                        return <div key={`div_${index}`} style={{
                            padding: '30px 0 30px 0',
                            borderRadius: '10px'
                        }}>
                            <h3>{projectEnvConfig.envName}</h3>
                            <Row>
                                <Col offset={2}>
                                    <h4>部署配置</h4>
                                </Col>
                            </Row>
                            <FormItem key={`projectEnvConfig_publishBranch_${index}`} {...formItemLayout} label="发布分支">
                                {getFieldDecorator(`projectEnvConfig_publishBranch_${index}`, {
                                    initialValue: projectEnvConfig.publicBranch ? projectEnvConfig.publicBranch : ''
                                })(
                                    <Select
                                        placeholder="发布分支"
                                        style={{display: 'block'}}
                                    >
                                        {
                                            project.branchList && JSON.parse(project.branchList).map((item, branchIndex) => {
                                                return <Option
                                                    key={`projectEnvConfig_publishBranch_option${index}${branchIndex}`}
                                                    value={item}>{item}</Option>;
                                            })
                                        }

                                    </Select>
                                )}
                            </FormItem>
                            <Row>
                                <Col span={4}
                                     style={{textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', paddingRight: '7px'}}>选择服务器
                                    :</Col>
                                <Col span={20}>
                                    {

                                        serverMachineList && serverMachineList.filter(serverMachine => serverMachine.envId === projectEnvConfig.envId).map((serverMachine, serverMachineListIndex) => {

                                            const projectEnvIpTemp = projectEnvConfig.projectEnvIpMap && projectEnvConfig.projectEnvIpMap[serverMachine.ip];
                                            return <Row style={{paddingBottom: '10px'}}
                                                        key={`projectEnvConfig_projectEnvIp_${serverMachineListIndex}`}>
                                                <Col span={8}>
                                                    {getFieldDecorator(`projectEnvConfig_projectEnvIp_serverIp_${index}_${serverMachineListIndex}`, {
                                                        valuePropName: 'checked',
                                                        initialValue: !!(projectEnvIpTemp && projectEnvIpTemp.serverIp)
                                                    })(
                                                        <Checkbox>{serverMachine.name}-{serverMachine.ip}</Checkbox>
                                                    )}
                                                </Col>
                                                <Col span={16}>设置为发布服务器 : &nbsp;&nbsp;
                                                    {getFieldDecorator(`projectEnvConfig_projectEnvIp_publish_${index}_${serverMachineListIndex}`, {
                                                        valuePropName: 'checked',
                                                        initialValue: projectEnvIpTemp && projectEnvIpTemp.publish ? projectEnvIpTemp.publish : false
                                                    })(
                                                        <Switch />
                                                    )}
                                                </Col>
                                            </Row>;
                                        })
                                    }
                                </Col>
                            </Row>
                            <FormItem key={`projectEnvConfig_selectBranch_${index}`} {...formItemLayout}
                                      label="可选择分支发布">
                                {getFieldDecorator(`projectEnvConfigSelectBranch_${index}`, {
                                    valuePropName: 'checked',
                                    initialValue: projectEnvConfig.selectBranch
                                })(
                                    <Switch/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="选择同步服务器">
                                {getFieldDecorator(`projectEnvConfigSyncServerMachineId_${index}`, {
                                    initialValue: projectEnvConfig && projectEnvConfig.syncServerMachineId
                                })(
                                    <RadioGroup onChange={() => {
                                    }}>
                                        {
                                            serverMachineList && serverMachineList.map((serverMachine, serverMachineListIndex) => {
                                                return <Radio key={`serverMachineListIndex${serverMachineListIndex}`}
                                                              value={serverMachine.id}>{serverMachine.name}-{serverMachine.ip}</Radio>;
                                            })
                                        }
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <Row>
                                <Col span={4}
                                     style={{textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', paddingRight: '7px'}}>构建命令
                                    :</Col>
                                <Col span={20}>
                                    <Row>
                                        {
                                            projectEnvConfig.buildBeforeList ? projectEnvConfig.buildBeforeList.map((beforeItem, beforeIndex) => {
                                                return <div key={`buildBeforeList_${beforeIndex}`}>
                                                    <Col span={20}>
                                                        <FormItem
                                                            key={`${index}_${beforeIndex}_step_before`} {...formItemLayout}>
                                                            {getFieldDecorator(`projectEnvConfig_stepBefore_${index}_${beforeIndex}`, {
                                                                initialValue: beforeItem.step ? beforeItem.step : ''
                                                            })(
                                                                <Input placeholder="构建命令"/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={4}>
                                                        { beforeIndex === 0 ?
                                                            <Button shape="circle" icon="plus"
                                                                    onClick={() => {
                                                                        dispatch({
                                                                            type: 'projectModel/addProjectEnvConfigBuildBefore',
                                                                            payload: {envId: projectEnvConfig.envId}
                                                                        });
                                                                    }}
                                                            /> :
                                                            <Button shape="circle" icon="minus"
                                                                    onClick={() => {
                                                                        dispatch({
                                                                            type: 'projectModel/deleteProjectEnvConfigBuildBefore',
                                                                            payload: {
                                                                                envId: projectEnvConfig.envId,
                                                                                uuid: beforeItem.uuid
                                                                            }
                                                                        });
                                                                    }}
                                                            />}
                                                    </Col>
                                                </div>;
                                            }) : <FormItem {...formItemLayout}>
                                                {getFieldDecorator(`projectEnvConfig_stepBefore_${index}_0`, {
                                                    initialValue: ''
                                                })(
                                                    <Input placeholder="构建命令"/>
                                                )}
                                            </FormItem>
                                        }
                                    </Row>
                                </Col></Row>
                            <Row>
                                <Col span={4}
                                     style={{textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', paddingRight: '7px'}}>构建后命令:</Col>
                                <Col span={20}>
                                    {
                                        projectEnvConfig.buildAfterList && projectEnvConfig.buildAfterList.length > 0 ? projectEnvConfig.buildAfterList.map((afterItem, afterIndex) => {
                                            return <div key={`buildAfterList${afterIndex}`}>
                                                <Col span={20}>
                                                    <FormItem
                                                        key={`${index}_${afterIndex}_step_after`}{...formItemLayout}>
                                                        {getFieldDecorator(`projectEnvConfig_stepAfter_${index}_${afterIndex}`, {
                                                            initialValue: afterItem.step ? afterItem.step : ''
                                                        })(
                                                            <Input placeholder="构建后命令"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={4}>
                                                    { afterIndex === 0 ?
                                                        <Button shape="circle" icon="plus"
                                                                onClick={() => {
                                                                    dispatch({
                                                                        type: 'projectModel/addProjectEnvConfigBuildAfter',
                                                                        payload: {envId: projectEnvConfig.envId}
                                                                    });
                                                                }}
                                                        /> :
                                                        <Button shape="circle" icon="minus"
                                                                onClick={() => {
                                                                    dispatch({
                                                                        type: 'projectModel/deleteProjectEnvConfigBuildAfter',
                                                                        payload: {
                                                                            envId: projectEnvConfig.envId,
                                                                            uuid: afterItem.uuid
                                                                        }
                                                                    });
                                                                }}
                                                        />}
                                                </Col>
                                            </div>;
                                        }) :
                                            <FormItem
                                                {...formItemLayout}
                                                label="构建后命令">
                                                {getFieldDecorator(`projectEnvConfig_stepAfter${index}_0`, {
                                                    initialValue: ''
                                                })(
                                                    <Input placeholder="构建后命令"/>
                                                )}
                                            </FormItem>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={2}>
                                    <h4>同步配置</h4>
                                </Col>
                            </Row>
                            <Row style={{marginTop:'10px'}}>
                                <Col span={4}
                                     style={{textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', paddingRight: '7px'}}>构建后命令:</Col>
                                <Col span={20}>
                                    {
                                        projectEnvConfig.syncAfterList && projectEnvConfig.syncAfterList.length > 0 ? projectEnvConfig.syncAfterList.map((syncItem, syncIndex) => {
                                            return <div key={`syncAfterList${syncIndex}`}>
                                                <Col span={20}>
                                                    <FormItem
                                                        key={`${index}_${syncIndex}_step_after`} {...formItemLayout}>
                                                        {getFieldDecorator(`projectEnvConfig_sync_${index}_${syncIndex}`, {
                                                            initialValue: syncItem.step ? syncItem.step : ''
                                                        })(
                                                            <Input placeholder="构建后命令"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={4}>
                                                    { syncIndex === 0 ?
                                                        <Button shape="circle" icon="plus"
                                                                onClick={() => {
                                                                    dispatch({
                                                                        type: 'projectModel/addProjectEnvConfigSyncAfter',
                                                                        payload: {envId: projectEnvConfig.envId}
                                                                    });
                                                                }}
                                                        /> :
                                                        <Button shape="circle" icon="minus"
                                                                onClick={() => {
                                                                    dispatch({
                                                                        type: 'projectModel/deleteProjectEnvConfigSyncAfter',
                                                                        payload: {
                                                                            envId: projectEnvConfig.envId,
                                                                            uuid: syncItem.uuid
                                                                        }
                                                                    });
                                                                }}
                                                        />}
                                                </Col>
                                            </div>;
                                        }) :
                                            <div>
                                                <Col span={20}>
                                                    <FormItem {...formItemLayout}>
                                                        {getFieldDecorator(`projectEnvConfig_sync_${index}_0`, {
                                                            initialValue: ''
                                                        })(
                                                            <Input placeholder="同步后命令"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={4}>
                                                    <Button shape="circle" icon="plus"
                                                            onClick={() => {
                                                                dispatch({
                                                                    type: 'projectModel/addProjectEnvConfigSyncAfter',
                                                                    payload: {envId: projectEnvConfig.envId}
                                                                });
                                                            }}
                                                    />
                                                </Col>
                                            </div>
                                    }
                                </Col>
                            </Row>
                        </div>;
                    })
                }
            </div>
            <FormItem style={{marginTop: '20px'}} wrapperCol={{span: 1, offset: 23}}>
                <Button type="primary" onClick={submit}>提交</Button>
            </FormItem>
        </div>
    );
}
export default Form.create()(ProjectFormComponent);
