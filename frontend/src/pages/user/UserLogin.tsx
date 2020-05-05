import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import styles from '@/pages/user/UserLogin.less';
import logo from '@/assets/logo.svg';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { DefaultFooter, PageLoading } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { UserPageProps } from '@/pages/user/UserPageProps';

const UserLogin: React.FC<UserPageProps> = ({ dispatch, user }) => {
  if (!dispatch) {
    return <PageLoading/>;
  }
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
              const payload = values;
              dispatch({
                type: 'user/login',
                payload,
              });
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
              <Button loading={user.loading} type="primary" size='large' htmlType="submit" block>
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <DefaultFooter
        copyright="MKfree Deploy 2016-2020"
        links={[
          {
            key: 'Mkfree Deploy',
            title: 'Mkfree Deploy',
            href: 'https://gitee.com/381895649/mkfree-deploy',
            blankTarget: true,
          },
        ]}
      />
    </div>

  );
};
export default connect(({ user }: UserPageProps) => ({ user }))(UserLogin);
