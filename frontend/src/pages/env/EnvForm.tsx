import { Button, Form, Input, notification, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { history } from '@@/core/history';
import routes, { HttpMethod } from '@/routes';
import { PageLoading } from '@ant-design/pro-layout';
import { ServerDto } from '@/services/dto/ServerDto';
import { EnvDto } from '@/services/dto/EnvDto';
import {  USER_KEY } from '@/services/dto/UserDto';

interface EnvPageProps {
  info?: ServerDto;
  edit?: boolean
}

export default (props: EnvPageProps) => {

  const [info, setInfo] = useState();
  const [url, setUrl] = useState();
  const [method, setMethod] = useState();

  useEffect(() => {
    if (props?.info && props?.info?.id) {
      setInfo(props?.info);
      setUrl(`${routes.apiRoutes.envUpdate.url}`);
      setMethod(HttpMethod.put);
    } else {
      setUrl(`${routes.apiRoutes.envSave.url}`);
      setMethod(HttpMethod.post);
    }
  });

  const { run, loading } = useRequest(
    (payload) => {
      return ({
        url: url,
        method: method,
        headers: {
          access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
        },
        data: payload,
      });
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        if (data.code === 1) {
          notification.success({
            message: `服务器：${params[0]?.name}`,
            description: props.edit ? '修改操作成功' : '添加成功',
          });
          history.replace(routes.pageRoutes.envIndex);
        } else {
          notification.error({
            message: `请求错误 ${data.code}: ${url}`,
            description: data.desc,
          });
        }
      },
    });

  const envResult = useRequest<ApiResult<EnvDto[]>>(() => ({
    url: `${routes.apiRoutes.envList.url}`,
    method: routes.apiRoutes.envList.method,
    headers: {
      access_token: localStorage.getItem(USER_KEY.ACCESS_TOKEN),
    },
  }), { manual: false });

  if (!info?.id && props.edit) {
    return <PageLoading/>;
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      initialValues={info}
      onFinish={(formValue) => {
        console.log('form submit payload', formValue);
        run(formValue);
      }}
    >
      {info?.id ?
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
        name="code"
        label="code"
        rules={[
          {
            required: true,
            message: '请输入环境code!',
          },
        ]}
      >
        <Input placeholder='code'/>
      </Form.Item>
      <Form.Item
        name="name"
        label="名称"
        rules={[
          {
            required: true,
            message: '请输入环境名称!',
          },
        ]}
      >
        <Input placeholder='name'/>
      </Form.Item>

      <Form.Item
        name="sort"
        label="排序"
        rules={[
          {
            required: true,
            message: '请输入排序号!',
          },
        ]}
      >
        <Input placeholder='sort'/>
      </Form.Item>

      <Form.Item
        label=' '
        colon={false}
        name='isEnable'
        valuePropName='checked'
      >
        <Switch checkedChildren="启用" unCheckedChildren="关闭"/>
      </Form.Item>


      <Form.Item label=' ' colon={false}>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
