import React from 'react';
import {Button, Table, Row, Col, Icon, Form, Input, Switch} from 'antd';

const FormItem = Form.Item;

function ProjectFormComponent({dispatch, project, deployTargetFileList, projectEnvConfigList, form, isAdd}) {


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


            const newStructureBeforeList = [];
            item.structureBeforeList.forEach((beforeItem, afterIndex) => {
                newStructureBeforeList.push({
                    step: getFieldValue(`stepBefore${index}${afterIndex}`),
                });
            });

            const newStructureAfterList = [];
            item.structureAfterList.forEach((afterItem, afterIndex) => {
                newStructureAfterList.push({
                    step: getFieldValue(`stepAfter${index}${afterIndex}`),
                    restart: getFieldValue(`isRestartAfter${index}${afterIndex}`),
                });
            });
            newProjectEnvConfigList.push({
                env: item.env,
                publicBranch: getFieldValue(`publicBranch${index}`),
                serverMachineIpList: `${getFieldValue(`serverMachineIpList${index}`)}`.split(','),
                structureBeforeList: newStructureBeforeList,
                structureAfterList: newStructureAfterList
            });
        });

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
            </div>
            <div style={{border: '1px solid #e9e9e9', padding: '15px', borderRadius: '10px', marginTop: '20px'}}>
                <h2>部署文件</h2>
                <FormItem style={{marginTop: '20px'}} wrapperCol={{span: 2, offset: 22}}>
                    <Button onClick={() => {
                        dispatch({type: 'projectModel/addDeployTargetFile'});
                    }}>添加一项</Button>
                </FormItem>
                {
                    deployTargetFileList.map((item, index) => {
                        return <div key={`deploy_div_${index}`}>
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

                        </div>;
                    })
                }
            </div>

            <div style={{border: '1px solid #e9e9e9', padding: '15px', marginTop: '20px', borderRadius: '10px'}}>
                <h2 style={{paddingTop: '20px'}}>环境配置</h2>
                {
                    projectEnvConfigList.map((item, index) => {
                        return <div key={`div_${index}`} style={{
                            padding: '30px 0 30px 0',
                            borderRadius: '10px'
                        }}>
                            <h3>{item.envText}</h3>
                            <Row>
                                <Col offset={2}>
                                    <h4>部署配置</h4>
                                </Col>
                            </Row>
                            <FormItem key={`${index}_1`} {...formItemLayout} label="发布分支">
                                {getFieldDecorator(`publicBranch${index}`, {
                                    initialValue: item.publicBranch ? item.publicBranch : ''
                                })(
                                    <Input placeholder="发布分支"/>
                                )}
                            </FormItem>
                            <FormItem key={`${index}_2`} {...formItemLayout} label="服务器ip">
                                {getFieldDecorator(`serverMachineIpList${index}`, {
                                    initialValue: item.serverMachineIpList ? item.serverMachineIpList : ''
                                })(
                                    <Input placeholder="服务器ip"/>
                                )}
                            </FormItem>
                            {
                                item.structureBeforeList && item.structureBeforeList.length > 0 ? item.structureBeforeList.map((beforeItem, beforeIndex) => {
                                    return <FormItem key={`${index}_${beforeIndex}_before`} {...formItemLayout}
                                                     label="构建命令">
                                        {getFieldDecorator(`stepBefore${index}${beforeIndex}`, {
                                            initialValue: beforeItem.step ? beforeItem.step : ''
                                        })(
                                            <Input placeholder="构建命令"/>
                                        )}
                                    </FormItem>;
                                }) : <FormItem {...formItemLayout}
                                               label="构建命令">
                                    {getFieldDecorator(`stepBefore${index}0`, {
                                        initialValue: ''
                                    })(
                                        <Input placeholder="构建命令"/>
                                    )}
                                </FormItem>
                            }
                            {
                                item.structureAfterList && item.structureAfterList.length > 0 ? item.structureAfterList.map((afterItem, afterIndex) => {
                                    return <FormItem key={`${index}_${afterIndex}_step_after`}
                                                     {...formItemLayout}
                                                     label="构建后命令">
                                        {getFieldDecorator(`stepAfter${index}${afterIndex}`, {
                                            initialValue: afterItem.step ? afterItem.step : ''
                                        })(
                                            <Input placeholder="构建后命令"/>
                                        )}
                                    </FormItem>;
                                }) :
                                    <FormItem
                                        {...formItemLayout}
                                        label="构建后命令">
                                        {getFieldDecorator(`stepAfter${index}0`, {
                                            initialValue: ''
                                        })(
                                            <Input placeholder="构建后命令"/>
                                        )}
                                    </FormItem>
                            }
                            <Row>
                                <Col offset={2}>
                                    <h4>同步配置</h4>
                                </Col>
                            </Row>
                            {
                                item.structureSyncList && item.structureSyncList.length > 0 ? item.structureSyncList.map((syncItem, syncIndex) => {
                                    return <FormItem key={`${index}_${syncIndex}_sync`}
                                                     {...formItemLayout}
                                                     label="构建后命令">
                                        {getFieldDecorator(`sync${index}${syncIndex}`, {
                                            initialValue: syncItem.step ? syncItem.step : ''
                                        })(
                                            <Input placeholder="构建后命令"/>
                                        )}
                                    </FormItem>;
                                }) :
                                    <FormItem
                                        {...formItemLayout}
                                        label="同步后命令">
                                        {getFieldDecorator(`sync${index}0`, {
                                            initialValue: ''
                                        })(
                                            <Input placeholder="同步后命令"/>
                                        )}
                                    </FormItem>
                            }
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
