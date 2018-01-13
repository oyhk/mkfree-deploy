import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';

const Option = Select.Option;
const FormItem = Form.Item;

function UserEditRoute({dispatch, location, form, user}) {

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
    return (
        <div>
            <h2>{user.username} 资料</h2>
            <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('username', {
                    rules: [{
                        required: true,
                        message: '用户名不能为空',
                    }],
                    initialValue: user.username
                })(
                    <Input placeholder="用户名"/>
                )}
            </FormItem>
        </div>
    );
}

UserEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {user} = state.userModel;
    return {user};
}

export default Form.create()(connect(mapStateToProps)(UserEditRoute));
