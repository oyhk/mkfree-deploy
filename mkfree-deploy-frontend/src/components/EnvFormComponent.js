import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {models} from '../Constant';
const Option = Select.Option;
const FormItem = Form.Item;

function EnvFormComponent({dispatch, location, form, env, title, isAdd}) {


    const {getFieldDecorator, getFieldValue} = form;
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
    return (
        <div>
            <h2>{title}环境</h2>
            <Form>
                <FormItem {...formItemLayout} label="名称">
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true,
                            message: '名称不能为空',
                        }],
                        initialValue: env.name
                    })(
                        <Input placeholder="名称"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="编码">
                    {getFieldDecorator('code', {
                        rules: [{
                            required: true,
                            message: '编码不能为空',
                        }],
                        initialValue: env.code
                    })(
                        <Input placeholder="编码"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="序号">
                    {getFieldDecorator('sort', {
                        rules: [{
                            required: true,
                            message: '序号不能为空',
                        }],
                        initialValue: env.sort
                    })(
                        <Input placeholder="序号，用于排序"/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit"
                            onClick={() => {
                                if (isAdd) {
                                    dispatch({
                                        type: `${models.env}/saved`,
                                        payload: {
                                            name: getFieldValue('name'),
                                            code: getFieldValue('code'),
                                            sort: getFieldValue('sort')
                                        }
                                    });
                                } else {
                                    dispatch({
                                        type: `${models.env}/update`,
                                        payload: {
                                            id: env.id,
                                            name: getFieldValue('name'),
                                            code: getFieldValue('code'),
                                            sort: getFieldValue('sort')
                                        }
                                    });
                                }
                            }}
                    >提交</Button>
                </FormItem>

            </Form>
        </div>
    );
}


export default Form.create()(EnvFormComponent);
