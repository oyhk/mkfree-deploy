import React from 'react';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 19},
};

function ProjectFormComponent({dispatch,getFieldDecorator,project,deployTargetFileList,projectEnvConfigList}) {
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
                                    initialValue: item.localFilePath
                                })(
                                    <Input placeholder="上传文件路劲"/>
                                )}
                            </FormItem>
                            <FormItem key={`deploy_${index}_1`} {...formItemLayout} label="服务器路劲">
                                {getFieldDecorator(`remoteFilePath${index}`, {
                                    initialValue: item.remoteFilePath
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
                                    initialValue: item.isEnable === 'YES'
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
                            <FormItem key={`${index}_3`} {...formItemLayout} label="构建命令">
                                {getFieldDecorator(`structureBeforeList${index}`, {
                                    initialValue: item.structureBeforeList ? item.structureBeforeList : ''
                                })(
                                    <Input placeholder="构建命令"/>
                                )}
                            </FormItem>
                            <FormItem key={`${index}_4`} {...formItemLayout} label="构建后命令">
                                {getFieldDecorator(`structureAfterList${index}`, {
                                    initialValue: item.structureAfterList ? item.structureAfterList : ''
                                })(
                                    <Input placeholder="构建后命令"/>
                                )}
                            </FormItem>
                        </div>;
                    })
                }


            </div>
        </div>
    );
}
export default ProjectFormComponent;
