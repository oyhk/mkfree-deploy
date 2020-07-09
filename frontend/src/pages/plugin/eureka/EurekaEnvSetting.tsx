import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { EnvDto } from '@/services/dto/EnvDto';
import routes from '@/routes';
import { Button, Col, Form, Input, notification, Radio, Row, Select, Switch } from 'antd';
import { PluginEnvSettingDto } from '@/services/dto/PluginEnvSettingDto';
import { PageLoading, PageHeaderWrapper } from '@ant-design/pro-layout';
import { MinusCircleOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';

/**
 * 插件环境配置
 */
export default () => {

  const [form] = Form.useForm();

  const [pluginEnvSettingList, setPluginEnvSettingList] = useState<PluginEnvSettingDto[]>();

  const pluginEnvSettingListUseRequest = useRequest<ApiResult<PluginEnvSettingDto[]>>(
    routes.apiRoutes.pluginEnvSettingList({ pluginName: 'Eureka' }),
    {
      manual: false,
      refreshOnWindowFocus: false,
      onSuccess: (ar: ApiResult<PluginEnvSettingDto[]>, params) => {
        setPluginEnvSettingList(ar.result);
        return ar;
      },
    });


  const selectEnvListUseRequest = useRequest<ApiResult<EnvDto[]>>(
    routes.apiRoutes.envList(),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });


  const pluginEnvSettingSaveOrUpdateUseRequest = useRequest<ApiResult<PluginEnvSettingDto[]>>(
    (payload) => {
      console.log(payload);
      return routes.apiRoutes.pluginEnvSettingSave(payload);
    },
    {
      manual: true,
      refreshOnWindowFocus: false,
      onSuccess: (ar: ApiResult<PluginEnvSettingDto[]>, params) => {
        if (ar.code === 1) {
          notification.success({
            message: `Eureka环境配置`,
            description: '成功',
          });
          history.replace(routes.pageRoutes.pluginEurekaIndex);
        } else {
          notification.error({
            message: `请求错误 ${ar.code}: ${routes.apiRoutes.pluginEnvSettingSave(params[0]).url}`,
            description: ar.desc,
          });
        }
        return ar;
      },
    });

  if (!pluginEnvSettingList) {
    return <PageLoading/>;
  }

  return (
    <PageHeaderWrapper>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        initialValues={pluginEnvSettingListUseRequest?.data}
        onFinish={(payload) => {
          if (!payload) {
            return;
          }
          console.log('project submit payload : ', payload);
          pluginEnvSettingSaveOrUpdateUseRequest.run({ pluginEnvSettingList: payload.result });
        }}
      >
        <Form.List name="result">
          {(fields, { add, remove }) => {
            return (
              <div>
                <h2>选择环境</h2>
                <Row>
                  <Col xl={4} style={{ textAlign: 'right', lineHeight: '24px' }}>
                  </Col>
                  <Col xl={16}>
                    <Select mode="multiple"
                            style={{ minWidth: '100%' }}
                            value={pluginEnvSettingList?.map(pluginEnvSetting => pluginEnvSetting.envId)}
                            onSelect={(values, option) => {
                              add();
                              pluginEnvSettingList.push({
                                envId: option.value,
                                envName: option.children,
                                pluginName: 'Eureka',
                                defaultShow: false,
                              });
                              form.setFieldsValue({ result: pluginEnvSettingList });
                            }}
                    >
                      {
                        selectEnvListUseRequest.data?.result?.map(envDto => <Select.Option
                          disabled={pluginEnvSettingList?.map(pluginEnvSetting => pluginEnvSetting.envId)?.indexOf(envDto.id as number) !== -1}
                          value={envDto?.id as number}
                          key={envDto?.code}
                          type={envDto}>{envDto?.name}</Select.Option>)
                      }
                    </Select>
                  </Col>
                </Row>
                {
                  fields.map((pluginEnvSettingField, pluginEnvSettingFieldIndex) => {

                    pluginEnvSettingField.record = pluginEnvSettingList[pluginEnvSettingFieldIndex];

                    return (
                      <div key={pluginEnvSettingFieldIndex}>
                        <Row style={{ marginBottom: '24px', paddingTop: '30px' }}>
                          <Col xl={4}>
                            <h3>&nbsp;&nbsp;&nbsp;&nbsp;{pluginEnvSettingField?.record?.envName}</h3>
                          </Col>
                          <Col xl={16} style={{ textAlign: 'right' }}>
                            <MinusCircleOutlined
                              style={{ fontSize: '24px' }}
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(pluginEnvSettingField.name);
                                pluginEnvSettingList.splice(pluginEnvSettingField.name, 1);
                              }}
                            />
                          </Col>
                        </Row>
                        <Form.Item name={[pluginEnvSettingField.name, 'envId']} noStyle>
                          <Input type='hidden' value={pluginEnvSettingField?.record?.envId}/>
                        </Form.Item>
                        <Form.Item name={[pluginEnvSettingField.name, 'envName']} noStyle>
                          <Input type='hidden' value={pluginEnvSettingField?.record?.envName}/>
                        </Form.Item>
                        <Form.Item
                          label='默认环境'
                          name={[pluginEnvSettingField.name, 'defaultShow']}
                          valuePropName='checked'
                        >
                          <Switch checkedChildren="启用" unCheckedChildren="关闭"/>
                        </Form.Item>
                        <Form.Item
                          name={[pluginEnvSettingField.name, 'eurekaUrl']}
                          label='请求地址'>
                          <Input placeholder='Eureka URL'/>
                        </Form.Item>
                        < Form.Item
                          name={[pluginEnvSettingField.name, 'eurekaAuthType']}
                          label='认证方式'>
                          <Radio.Group>
                            <Radio value='none'>无</Radio>
                            <Radio value='Basic'>Basic</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name={[pluginEnvSettingField.name, 'eurekaUsername']}
                          label='用户名'>
                          <Input placeholder='Eureka Username'/>
                        </Form.Item>
                        <Form.Item
                          name={[pluginEnvSettingField.name, 'eurekaPassword']}
                          label='密码'>
                          <Input placeholder='Eureka Password'/>
                        </Form.Item>
                      </div>
                    );
                  })
                }

              </div>
            );
          }}
        </Form.List>

        <Form.Item label=' ' colon={false} style={{ marginTop: '10vh' }}>
          <Button type="primary" htmlType="submit" block
                  loading={pluginEnvSettingSaveOrUpdateUseRequest.loading || pluginEnvSettingSaveOrUpdateUseRequest.loading}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
}
