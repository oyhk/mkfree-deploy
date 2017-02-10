/**
 * Created by wangzimin on 2017/2/8.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Form, Input, Button, Checkbox} from 'antd';
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

  const submit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
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

      dispatch({
        type: `userInfo/${location.pathname.includes('create') ? 'userSave' : 'userUpdate'}`,
        payload,
      });
      if (!err) {

      }
    });
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

  //const changeListData = ()=> {
  //  if (params.id) {
  //    listData = result.data.userProjectPermissionList;
  //  } else {
  //    const userProjectPermissionList = result.list;
  //    if (userProjectPermissionList && userProjectPermissionList.length > 0) {
  //      userProjectPermissionList.map((dt, index)=> {
  //        listData.push({
  //          projectId: dt.id,
  //          projectName: dt.name,
  //          projectEnv: [],
  //        })
  //      })
  //    }
  //  }
  //};
  //
  const permissionSubmit = (value, index)=> {
    _listData = listData;
    _listData[index].projectEnv = value;
    dispatch({
      type: `userInfo/changeState`,
      payload: listData
    });
  };


  const permissionList = ()=> {
    if (listData && listData.length > 0) {
      return listData.map((dt, index)=> {
        return (
          <FormItem key={index} {...formItemLayout} label={dt.projectName}>
            <CheckboxGroup options={permissionName} value={dt.projectEnv}
                           onChange={(value)=> permissionSubmit(value, index)}/>
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
                initialValue: result.username,
              })(<Input />)
            }
          </FormItem>
          {
            location.hostname.includes(ROUTE_ADMIN_USERS_CREATE) ?
              <FormItem {...formItemLayout} label="密码">
                {
                  getFieldDecorator('password', {
                    initialValue: result.password,
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
            <Button size="large">删除</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default connect(({users}) => {
  return {users}
})(Form.create()(UserInfo));
