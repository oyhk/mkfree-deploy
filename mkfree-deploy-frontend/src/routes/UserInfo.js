/**
 * Created by wangzimin on 2017/2/8.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Form, Input, Button, Checkbox} from 'antd';
import styles from '../routes/Users.less'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function UserInfo({dispatch, userInfo, form, params}) {

  const { id, username, password, result } = userInfo;
  const { validateFields, getFieldDecorator } = form;

  const BaseInfoSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      dispatch({
        type: 'userInfo/userUpdate',
        payload: {
          id: params.id,
          username: values.username,
          password: values.password,
        }
      });
      if (!err) {

      }
    });
  };

  const permissionSubmit = (value, index)=> {
    listData[index].projectEnv = value;
    dispatch({
      type: 'userInfo/userProjectPermissionUpdate',
      payload: listData
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
  let listData = [];
  const changeListData = ()=> {
    if (params.includes('create')) {
      if (result.data.list || result.data.listlength > 0) {
        result.data.list.map((dt, index)=> {
          listData.push({
            projectId: dt.id,
            projectName: dt.name,
          })
        })
      }
    } else {
      listData = result;
    }
  };

  //const listData = [
  //  {
  //    id: 6,
  //    projectId: 505,
  //    projectName: "test-api",
  //    //userId: 123,
  //    projectEnv: [
  //      "DEV",
  //      "UAT",
  //    ]
  //  },
  //  {
  //    id: 5,
  //    projectId: 53,
  //    projectName: "UAT-api",
  //    //userId: 34,
  //    projectEnv: [
  //      "DEV",
  //      "PROD",
  //    ]
  //  }
  //];

  const permissionList = ()=> {
    if (result || result.length > 0) {
      result.map((dt, index)=> {
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
        <Form onSubmit={(e)=> BaseInfoSubmit(e)}>
          <FormItem {...formItemLayout} label="账户">
            {
              getFieldDecorator('username', {
                initialValue: username,
              })(<Input />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {
              getFieldDecorator('password', {
                initialValue: password,
              })(<Input />)
            }
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </Form>
      </div>
      <div className={styles.permission}>
        <h2>2.项目权限</h2>
        <Form>
          {permissionList}
        </Form>
      </div>
    </div>
  )
}

export default connect(({userInfo}) => {
  return {userInfo}
})(Form.create()(UserInfo));
