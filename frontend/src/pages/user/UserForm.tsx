import { Button, Form, Input, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { UserDto } from '@/services/dto/UserDto';
import { history } from '@@/core/history';
import routes from '@/routes';
import { PageLoading } from '@ant-design/pro-layout';

interface UserPageProps {
  user?: UserDto;
  edit?: boolean
}

export default (props: UserPageProps) => {

  const [user, setUser] = useState();
  const [url, setUrl] = useState();
  const [method, setMethod] = useState();

  useEffect(() => {
    if (props?.user && props?.user?.id) {
      setUser(props?.user);
      setUrl(`${routes.apiRoutes.userUpdate}`);
      setMethod('put');
    } else {
      setUrl(`${routes.apiRoutes.userSave}`);
      setMethod('post');
    }
  });
  const { run, loading } = useRequest<ApiResult<UserDto>>(
    (payload) => {
      return ({
        url: url,
        method: method,
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
        data: payload,
      });
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        if (data.code === 1) {
          history.replace(routes.pageRoutes.userIndex);
          notification.success({
            message: `用户：${params[0]?.username}`,
            description: '操作成功',
          });
        } else {
          notification.error({
            message: `请求错误 ${data.code}: ${url}`,
            description: data.desc,
          });
        }
      },
    });

  if (!user?.id && props.edit) {
    return <PageLoading/>;
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      initialValues={user}
      onFinish={(formValue) => {
        console.log('form submit payload', formValue);
        run(formValue);
      }}
    >
      {user?.id ?
        <Form.Item
          name="id"
          rules={[
            {
              required: true,
              message: '编辑错误，id不存在!',
            },
          ]}
        >
          <Input placeholder='id' type='hidden'/>
        </Form.Item> : ''
      }
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      >
        <Input placeholder='username'/>
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input.Password placeholder='password'/>
      </Form.Item>
      <Form.Item
        name="roleType"
        label="类型"
        rules={[
          {
            required: true,
            message: '请选择类型!',
          },
        ]}
      >
        <Select>
          <Select.Option value={0}>超级管理员</Select.Option>
          <Select.Option value={1}>管理员</Select.Option>
          <Select.Option value={2}>普通成员</Select.Option>
        </Select>
      </Form.Item>


      <Form.Item label=' ' colon={false}>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
