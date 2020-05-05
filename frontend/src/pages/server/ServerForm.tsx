import { Button, Form, Input, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { history } from '@@/core/history';
import routes, { HttpMethod } from '@/routes';
import { PageLoading } from '@ant-design/pro-layout';
import { ServerDto } from '@/services/dto/ServerDto';
import { EnvDto } from '@/services/dto/EnvDto';

interface ServerPageProps {
  info?: ServerDto;
  edit?: boolean
}

export default (props: ServerPageProps) => {

  const [info, setInfo] = useState();
  const [url, setUrl] = useState();
  const [method, setMethod] = useState();

  useEffect(() => {
    if (props?.info && props?.info?.id) {
      setInfo(props?.info);
      setUrl(`${routes.apiRoutes.serverUpdate.url}`);
      setMethod(HttpMethod.PUT);
    } else {
      setUrl(`${routes.apiRoutes.serverSave.url}`);
      setMethod(HttpMethod.POST);
    }
  });

  const { run, loading } = useRequest(
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
          notification.success({
            message: `服务器：${params[0]?.name}`,
            description: props.edit ? '修改操作成功':'添加成功',
          });
          history.replace(routes.pageRoutes.serverIndex);
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
      access_token: localStorage.getItem('access_token'),
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
        name="name"
        label="服务器名称"
        rules={[
          {
            required: true,
            message: '请输入服务器名称!',
          },
        ]}
      >
        <Input placeholder='name'/>
      </Form.Item>
      <Form.Item
        name="intranetIp"
        label="内网ip"
        rules={[
          {
            required: true,
            message: '请输入内网ip!',
          },
        ]}
      >
        <Input placeholder='intranetIp'/>
      </Form.Item>

      <Form.Item
        name="ip"
        label="外网ip"
        rules={[
          {
            required: true,
            message: '请输入外网ip!',
          },
        ]}
      >
        <Input placeholder='ip'/>
      </Form.Item>
      <Form.Item
        name="sshUsername"
        label="ssh用户名"
        rules={[
          {
            required: true,
            message: '请输入ssh用户名!',
          },
        ]}
      >
        <Input placeholder='sshUsername'/>
      </Form.Item>
      <Form.Item
        name="sshPort"
        label="ssh端口"
        rules={[
          {
            required: true,
            message: '请输入ssh端口!',
          },
        ]}
      >
        <Input placeholder='sshPort'/>
      </Form.Item>

      <Form.Item
        name="envId"
        label="类型"
      >
        <Select>
          {envResult?.data?.result?.map((env: EnvDto) => <Select.Option value={env.id as number}>{env?.name}</Select.Option>)}
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
