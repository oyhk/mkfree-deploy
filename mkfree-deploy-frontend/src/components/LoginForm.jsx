import React, {Component, PropTypes} from "react";
import {browserHistory} from "dva/router";
import cookie from "react-cookie";
import {Button, Form, Icon, Input} from "antd";
const FormItem = Form.Item;
import {ROUTE_PROJECTS} from '../constants';


function SignInForm({dispatch, users, styles, form: {getFieldDecorator, validateFields, setFields, setFieldsValue}}) {
  const {username, password, userStr, loading}=users
  const disPatch = (type, payload, callBack) => {
    dispatch({type: 'users/' + type, payload, callBack})
    
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    validateFields((errors) => {
      if (!!errors) {
        return;
      }
      disPatch('changeState', {loading: true})
      disPatch('userLogin', {
        username: username,
        password: password
      }, (result) => {
        const {code, data}=result;
        if (code == 1) {
          let Options = {
            path: '/',
            maxAge: 30 * 24 * 60 * 60
          }
          cookie.save('user_token', data, Options);
          cookie.save('username', username, Options);
          disPatch('changeState', {username: '',password:''})
          browserHistory.push(ROUTE_PROJECTS)
        } else if (code == 101) {
          setFields({
            userName: {
              errors: [{
                message: '用户名不存在'
              }]
            },
          });
          setFieldsValue({password: ''})
          disPatch('changeState', {password: '', userName: ''})
        } else if (code == 103) {
          setFields({
            password: {
              errors: [{
                message: '密码错误'
              }]
            },
          });
          disPatch('changeState', {password: ''})
        }
        disPatch('changeState', {loading: false})
      })
    });
  }
  
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormItem>
        {getFieldDecorator('userName', {
          rules: [{required: true, message: '请输入用户名!'}],
        })(
          <Input
            prefix={<Icon type="user"/>}
            placeholder="用户名"
            onChange={(e) => {
              disPatch('changeState', {username: e.target.value})
            }}/>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('password', {
          rules: [{required: true, message: '请输入密码!'}],
        })(
          <Input
            prefix={<Icon type="lock"/>}
            type="password"
            placeholder="密码"
            onChange={(e) => {
              disPatch('changeState', {password: e.target.value})
            }}/>
        )}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={styles.button}
        >
          登录
        </Button>
      </FormItem>
    </Form>
  );
}
SignInForm = Form.create()(SignInForm);


export default SignInForm;
