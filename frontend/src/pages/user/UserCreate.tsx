import React, { useState } from 'react';
import { useFormTable, useRequest } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Link, history } from 'umi';
import routes from '@/routes';
import { UserAddOutlined } from '@ant-design/icons';
import { UserDto } from '@/services/dto/UserDto';
import { Button, Form, Input, notification, Select } from 'antd';
import { ApiResult } from '@/services/ApiResult';


export default () => {

  const url = 'http://localhost:5000/api/users/save';

  const { run } = useRequest<ApiResult<UserDto>>(
    (payload) => {
      return ({
        url: url,
        method: 'post',
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
        } else {
          notification.error({
            message: `请求错误 ${data.code}: ${url}`,
            description: data.desc,
          });
        }
      },
    });


  return (
    <PageHeaderWrapper>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        initialValues={{ roleType: 2 }}
        onFinish={(formValue) => {
          run(formValue);
        }}
      >
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
              message: '请输入用户名!',
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
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
};
