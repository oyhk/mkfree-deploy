import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import styles from '@/pages/user/UserLogin.less';
import logo from '@/assets/logo.svg';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Footer } from '@/utils/ComponentUtils';
import { useFormTable, useRequest } from '@umijs/hooks';
import routes from '@/routes';
import { history } from '@@/core/history';
import { ACCESS_TOKEN_KEY, UserDto, USERNAME } from '@/services/dto/UserDto';

export default () => {

  const loginUseRequest = useRequest((payload) => ({
    ...routes.apiRoutes.userLogin,
    isAll: true,
    data: payload,
  }), {
    manual: true,
    onSuccess: (apiResult, params) => {
      if (apiResult.result) {
        localStorage.setItem(ACCESS_TOKEN_KEY, apiResult.result.accessToken);
        localStorage.setItem(USERNAME, apiResult.result.username);
        history.push(routes.pageRoutes.root);
      }
    },
  });


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src={logo}/>
            <span className={styles.title}>Mkfree Deploy</span>
          </div>
          <div className={styles.desc}>Mkfree Deploy 轻量级自动化运维工具。</div>
        </div>
        <div className={styles.main}>
          <p className={styles.mainTitle}>登 录</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={(values) => {
              console.log('UserLogin payload ', values);
              loginUseRequest.run(values);
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入您的用户名！' }]}
            >
              <Input size='large' prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入您的密码！' }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} size='large' placeholder="密码"/>
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button loading={loginUseRequest.loading} type="primary" size='large' htmlType="submit" block>
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      {Footer}
    </div>

  );
};
