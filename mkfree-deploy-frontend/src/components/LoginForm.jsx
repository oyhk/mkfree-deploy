import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
const FormItem = Form.Item;

const LoginForm = Form.create()(React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    },
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: '请填写用户名'}],
                    })(
                        <Input addonBefore={<Icon type="user"/>} placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请填写密码'}],
                    })(
                        <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登 录
                    </Button>
                </FormItem>
            </Form>
        );
    },
}));
export default LoginForm;