import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

function ServerMachineFormComponent({dispatch, location, form, serverMachine, envList}) {

    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 8},
            sm: {span: 6},
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 4,
            },
            sm: {
                span: 20,
                offset: 4,
            },
        },
    };

    // if (serverMachine.envId) {
    //     setFieldsValue({
    //         envId: serverMachine.envId
    //     });
    // }


    return (
        <div>
            <h2>添加服务器</h2>
            <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                    rules: [{
                        required: true,
                        message: '名称不能为空',
                    }],
                    initialValue: serverMachine.name
                })(
                    <Input placeholder="名称"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="ssh用户名">
                {getFieldDecorator('username', {
                    rules: [{
                        required: true,
                        message: 'ssh用户名不能为空',
                    }],
                    initialValue: serverMachine.username
                })(
                    <Input placeholder="ssh用户名"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="ssh端口">
                {getFieldDecorator('port', {
                    rules: [{
                        required: true,
                        message: 'ssh端口不能为空',
                    }],
                    initialValue: serverMachine.port
                })(
                    <Input placeholder="ssh端口"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="ip地址">
                {getFieldDecorator('ip', {
                    rules: [{
                        required: true,
                        message: 'ip不能为空',
                    }],
                    initialValue: serverMachine.ip
                })(
                    <Input placeholder="ip"/>
                )}
            </FormItem>
            <FormItem{...formItemLayout} label="环境">
                {getFieldDecorator('envName', {
                    rules: [{
                        required: true,
                        message: 'envName 不能为空',
                    }],
                    initialValue: serverMachine.envName ? serverMachine.envName : '开发环境'
                })(
                    <Select selectedIndex={0} style={{width: '100%'}}>
                        {
                            envList.map((item, index) => {
                                return <Option key={item.id} value={`${item.name}`}>{item.name}</Option>;
                            })
                        }
                    </Select>
                )}

            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" onClick={() => {

                    if (serverMachine.id) {
                        dispatch({
                            type: 'serverMachineModel/update',
                            payload: {
                                id: serverMachine.id,
                                name: getFieldValue('name'),
                                username: getFieldValue('username'),
                                port: getFieldValue('port'),
                                ip: getFieldValue('ip'),
                                envName: getFieldValue('envName'),
                            }
                        });
                    } else {
                        dispatch({
                            type: 'serverMachineModel/saved',
                            payload: {
                                id: serverMachine.id,
                                name: getFieldValue('name'),
                                username: getFieldValue('username'),
                                port: getFieldValue('port'),
                                ip: getFieldValue('ip'),
                                envName: getFieldValue('envName'),
                            }
                        });
                    }

                }}>提交</Button>
            </FormItem>
        </div>
    );
}


export default Form.create()(ServerMachineFormComponent);
