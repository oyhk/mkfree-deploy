import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {models} from '../Constant';

const Option = Select.Option;
const FormItem = Form.Item;

function TagFormComponent({dispatch, location, form, tag, title, isAdd}) {


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
            <h2>{title}标签</h2>
            <Form>
                <FormItem {...formItemLayout} label="名称">
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true,
                            message: '名称不能为空',
                        }],
                        initialValue: tag && tag.name
                    })(
                        <Input placeholder="名称"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="状态">
                    {getFieldDecorator('status', {
                        valuePropName: 'checked',
                        rules: [{
                            required: true,
                            message: '状态不能为空',
                        }],
                        initialValue: tag && tag.status
                    })(
                        <Switch/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit"
                            onClick={() => {
                                let status = getFieldValue('status');
                                status = status || false;
                                if (isAdd) {
                                    dispatch({
                                        type: `${models.tag}/saved`,
                                        payload: {
                                            name: getFieldValue('name'),
                                            status
                                        }
                                    });
                                } else {
                                    dispatch({
                                        type: `${models.tag}/update`,
                                        payload: {
                                            id: tag.id,
                                            name: getFieldValue('name'),
                                            status
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


export default Form.create()(TagFormComponent);
