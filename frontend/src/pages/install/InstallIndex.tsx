import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Steps, Select, Row, notification } from 'antd';
import styles from '@/pages/install/InstallIndex.less';
import logo from '@/assets/logo.svg';
import { Footer } from '@/utils/ComponentUtils';
import routes from '@/routes';
import { useRequest } from 'ahooks';
import { history } from '@@/core/history';

export default () => {

  const [step, setStep] = useState(0);
  const installResult = useRequest((payload) => ({
    ...routes.apiRoutes.systemInstall,
    data: payload,
  }), {
    manual: true,
    formatResult: (res => res),
    onSuccess: (data, params) => {
      setStep(3);
      localStorage.setItem('installed', data.result);
    },
    refreshOnWindowFocus:false
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
          <p className={styles.mainTitle}>系统安装</p>
          <Steps current={step}>
            <Steps.Step title="第一步" description="超级管理员账号"/>
            <Steps.Step title="第二步" description="系统配置"/>
            <Steps.Step title="第三步" description="完成"/>
          </Steps>

          <Form
            style={{ paddingTop: '100px' }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={(formValue) => {
              console.log('install form submit payload', formValue);
              installResult.run(formValue);
            }}
          >

            <Form.Item

              style={{ display: (step === 0 || step === 2) ? 'flex' : 'none' }}
              name="username"
              label="超级管理员用户名"
              rules={[
                {
                  required: true,
                  message: '请输入超级管理员用户名!',
                },
              ]}
            >
              <Input placeholder='username'/>
            </Form.Item>
            <Form.Item
              style={{ display: (step === 0 || step === 2) ? 'flex' : 'none' }}
              name="password"
              label="超级管理员密码"
              rules={[
                {
                  required: true,
                  message: '请输入超级管理员密码!',
                },
              ]}
            >
              <Input.Password placeholder='password'/>
            </Form.Item>

            <Form.Item
              style={{ display: (step === 1 || step === 2) ? 'flex' : 'none' }}
              name="installPath"
              label="系统工作路径"
              rules={[
                {
                  required: true,
                  message: '请输入系统工作路径!',
                },
              ]}
            >
              <Input placeholder='installPath'/>
            </Form.Item>
            <Form.Item
              label=' '
              colon={false}
              style={{ display: (step === 0 || step === 1) ? 'flex' : 'none' }}
            >
              <Button type="primary" block onClick={() => {
                setStep(step + 1);
              }}>
                下一步
              </Button>
            </Form.Item>
            <Form.Item
              label=' '
              colon={false}
              style={{ display: (step === 2) ? 'flex' : 'none' }}

            >
              <Button loading={installResult.loading} type="primary" htmlType="submit" block>
                提 交
              </Button>
            </Form.Item>

            <Form.Item
              label=' '
              colon={false}
              style={{ display: (step > 0 && step < 3) ? 'flex' : 'none' }}
            >
              <Button type="dashed" danger block onClick={() => {
                setStep(step - 1);
              }}>
                上一步
              </Button>
            </Form.Item>

            <div
              style={{ textAlign: 'center', display: step === 3 ? 'block' : 'none' }}
            >
              系统安装成功！ <Button type='link' onClick={() => history.replace(routes.pageRoutes.userLogin)}>登录系统</Button>
            </div>
          </Form>

        </div>


      </div>
      {Footer}
    </div>
  );
};
