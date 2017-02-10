/**
 * Created by wangzimin on 2017/2/8.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import { Form, Input, Button, Checkbox, message, Popconfirm } from 'antd';
import styles from '../routes/Users.less'

import {
    ROUTE_ADMIN_USERS_INFO,
    ROUTE_ADMIN_USERS_CREATE,
} from "../constants";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function UserInfo({dispatch, users, form, params}) {

    const { username, password, result, listData } = users;
    const { validateFields, getFieldDecorator } = form;
    const isCreate = location.href.includes(ROUTE_ADMIN_USERS_CREATE);
    let deleteUserLock = false;
    let submitLock = false;

    const submit = (e) => {
        e.preventDefault();
        validateFields((err, values) => {
            if (!err) {
                return false;
            }

            let payload = {};

            if (location.pathname.includes('create')) {
                payload = {
                    username: values.username,
                    password: values.password,
                    userProjectPermissionList: listData,
                };
            } else {
                payload = {
                    id: params.id,
                    username: values.username,
                    password: values.password,
                    userProjectPermissionList: listData,
                };
            }

            if (!submitLock) {
                submitLock = true;
                dispatch({
                    type: `users/${location.pathname.includes('create') ? 'userSave' : 'userUpdate'}`,
                    payload,
                    callBack: (result)=> {
                        if (result.code === '1') {
                            console.log('callBack');
                            message.success('保存成功');
                            history.back();
                        } else {
                            submitLock = false;
                        }
                    }
                });
            } else {
                message.warning('请勿连续点击按钮', 2);
            }
        });
    };

    const deleteUser = ()=> {
        if (!deleteUserLock) {
            deleteUserLock = true;
            dispatch({
                type: `users/userDelete`,
                payload: {
                    id: params.id,
                },
                callBack: (result)=> {
                    if (result.code === '1') {
                        message.success('删除成功');
                        history.back();
                    } else {
                        deleteUserLock = false;
                    }
                }
            });
        } else {
            message.warning('请勿连续点击按钮');
        }
    };

    const formItemLayout = {
        labelCol: {span: 5},
        wrapperCol: {span: 10},
    };

    const tailFormItemLayout = {
        wrapperCol: {
            span: 10,
            offset: 5,
        },
    };

    const permissionName = ['DEV', 'UAT', 'TEST', 'PROD'];
    let _listData = [];

    const permissionSubmit = (value, index)=> {
        _listData = listData;
        _listData[index].projectEnv = value;
        dispatch({
            type: `users/changeState`,
            payload: {
                listData: _listData,
            }
        });
    };

    const permissionList = ()=> {
        if (listData && listData.length > 0) {
            return listData.map((dt, index)=> {
                return (
                    <FormItem key={index} {...formItemLayout} label={dt.projectName}>
                        <CheckboxGroup
                            options={permissionName} value={dt.projectEnv}
                            onChange={(value)=> permissionSubmit(value, index)}
                        />
                    </FormItem>
                )
            });
        }
    };

    return (
        <div className={styles.userInfo}>
            <div className={styles.baseInfo}>
                <h2>1.基本信息</h2>
                <Form onSubmit={(e)=> submit(e)}>
                    <FormItem {...formItemLayout} label="账户">
                        {
                            getFieldDecorator('username', {
                                initialValue: isCreate ? '' : username,
                                rules: [{required: true, message: '请输入账户!'}],
                            })(<Input />)
                        }
                    </FormItem>
                    {
                        isCreate ?
                            <FormItem {...formItemLayout} label="密码">
                                {
                                    getFieldDecorator('password', {
                                        initialValue: isCreate ? '' : password,
                                        rules: [{required: true, message: '请输入密码!'}],
                                    })(<Input />)
                                }
                            </FormItem> : ''
                    }
                </Form>
            </div>
            <div className={styles.permission}>
                <h2>2.项目权限</h2>
                <Form onSubmit={(e)=> submit(e)}>
                    {
                        permissionList()
                    }
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">确定</Button>
                        {
                            isCreate ? '' :
                                <Popconfirm title="确认删除?" onConfirm={deleteUser}>
                                    <Button size="large">删除</Button>
                                </Popconfirm>
                        }
                    </FormItem>
                </Form>
            </div>
        </div>
    )
}

export default connect(({users}) => {
    return {users}
})(Form.create()(UserInfo));
