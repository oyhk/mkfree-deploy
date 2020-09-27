import React, { useRef } from 'react';
import { uuid } from '@/utils/utils';
import {
  Col,
  Layout,
  Row,
  Select,
  Tree,
  Checkbox,
  Form,
  Input,
  Button,
  Radio,
  Switch,
  notification,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { EnvDto } from '@/services/dto/EnvDto';
import routes from '@/routes';
import { PlanDto } from '@/services/dto/PlanDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';
import { ServerDto } from '@/services/dto/ServerDto';
import { PlanEnvProjectConfigDto, PlanEnvProjectConfigType } from '@/services/dto/PlanEnvProjectConfigDto';
import { USER_KEY } from '@/services/dto/UserDto';
import { PlanScriptDto } from '@/services/dto/PlanScriptDto';
import { PageLoading } from '@ant-design/pro-layout';
import { history } from '@@/core/history';
import { PlanProjectSortDto } from '@/services/dto/PlanProjectSortDto';

const { Sider, Content } = Layout;

export default (props: any) => {

  const [form] = Form.useForm();

  const plan: PlanDto = props.plan;

  const checkBoxProjectListRef = useRef();

  // 插件列表
  const pluginListUseResult = useRequest<ApiResult<any>>(
    () => routes.apiRoutes.pluginList()
    ,
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  const planProjectSortUseRequest = useRequest<ApiResult<PlanProjectSortDto[]>>(
    () => routes.apiRoutes.planProjectSortList(),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  const selectEnvListUseRequest = useRequest<ApiResult<EnvDto[]>>(
    routes.apiRoutes.envList(),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  const serverListUseRequest = useRequest<ApiResult<ServerDto[]>>(
    () => routes.apiRoutes.serverList(),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  // form 表单提交
  const formSaveUseRequest = useRequest<ApiResult<ServerDto[]>>(
    (payload) => routes.apiRoutes.planSave(payload),
    {
      onSuccess: (apiResult, params) => {

        if (apiResult.code === 1) {
          notification.success({
            message: `版本计划：${params[0].name}`,
            description: '添加成功',
          });
          history.replace(routes.pageRoutes.planIndex);
        } else {
          notification.error({
            message: `请求错误 ${apiResult.code}: ${routes.apiRoutes.planSave().url}`,
            description: apiResult.desc,
          });
        }
      },
      manual: true,
      refreshOnWindowFocus: false,
    });

  const formUpdateUseRequest = useRequest<ApiResult<ServerDto[]>>(
    (payload) => routes.apiRoutes.planUpdate(payload),
    {
      onSuccess: (apiResult, params) => {

        if (apiResult.code === 1) {
          notification.success({
            message: `版本计划：${params[0].name}`,
            description: '修改成功',
          });
          history.replace(routes.pageRoutes.planIndex);
        } else {
          notification.error({
            message: `请求错误 ${apiResult.code}: ${routes.apiRoutes.planUpdate().url}`,
            description: apiResult.desc,
          });
        }
      },
      manual: true,
      refreshOnWindowFocus: false,
    });

  if (!planProjectSortUseRequest?.data?.result) {
    return <PageLoading/>;
  }
  if (!serverListUseRequest?.data?.result) {
    return <PageLoading/>;
  }
  if (!selectEnvListUseRequest.data) {
    return <PageLoading/>;
  }

  const planProjectSortList = planProjectSortUseRequest.data.result;


  return (
    <Layout>
      <Sider theme='light'
             width='21%'
      >
        <Checkbox.Group
          ref={checkBoxProjectListRef}
          defaultValue={(plan.planEnvList.length > 0 ? plan.planEnvList[0].planEnvProjectConfigList?.map((planEnvProjectConfig: PlanEnvProjectConfigDto) => planEnvProjectConfig.projectId) : []) as number[]}
          onChange={(selectedProjectIdList) => {
            plan.planEnvList = form.getFieldValue('planEnvList');
            selectedProjectIdList.forEach((projectId) => {
              plan.planEnvList.forEach((planEnv) => {
                const existProjectIdList = planEnv.planEnvProjectConfigList.map(planEnvProjectConfig => planEnvProjectConfig.projectId);
                if (existProjectIdList.indexOf(projectId as number) === -1) {
                  const planProjectSort = planProjectSortList.filter(value => value.projectId === projectId)[0];
                  planEnv.planEnvProjectConfigList.push({
                    projectId: projectId as number,
                    projectName: planProjectSort.projectName,
                    projectSort: planProjectSort.sort,
                    type: PlanEnvProjectConfigType.project.code,
                    isEnableCustomConfig: false,
                  });
                }
              });
            });

            plan.planEnvList.forEach((planEnv) => {
              // 0 是公共配置，所以要保留
              planEnv.planEnvProjectConfigList = planEnv.planEnvProjectConfigList.filter(value => (selectedProjectIdList.indexOf(value.projectId as number) > -1) || value.projectId === 0);
            });

            // 使用setFieldsValue 替换整个字段初始化内容
            form.setFieldsValue({
              'planEnvList': plan.planEnvList,
            });
          }}
        >
          <Row style={{ padding: '10px' }}>
            {
              planProjectSortList?.map((planProjectSort) => (
                <Col span={24} key={planProjectSort.id}>
                  <Checkbox value={planProjectSort.projectId}>{planProjectSort.projectName}</Checkbox>
                </Col>
              ))
            }
          </Row>
        </Checkbox.Group>

      </Sider>
      <Content style={{ padding: '0px 10px' }}>


        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          initialValues={props.plan ? props.plan : plan}
          onFinish={(planDto) => {
            console.log('project submit payload : ', planDto);
            if (plan.id) {
              formUpdateUseRequest.run(planDto);
            } else {
              formSaveUseRequest.run(planDto);
            }

          }}
        >
          {/*基本信息*/}
          <div>
            <Form.Item name='id' noStyle>
              <Input type='hidden'/>
            </Form.Item>
            <h2>基本信息</h2>
            <Form.Item label="版本计划名称" name="name" rules={[{ required: true, message: '必填' }]}>
              <Input/>
            </Form.Item>
          </div>
          {/*脚本*/}
          <div>
            <h2>相关脚本</h2>
            <Form.List name="planScriptList">
              {(fields, { add, remove }) => {

                plan.planScriptList.forEach((planScript, planScriptIndex) => {
                  fields[planScriptIndex].record = planScript;
                });

                return (
                  <div>
                    {
                      fields.map((planScriptListField, planScriptListIndex) => <div key={uuid()}>
                        <Form.Item name={[planScriptListField.name, 'userId']} noStyle>
                          <Input type='hidden'/>
                        </Form.Item>
                        <Form.Item name={[planScriptListField.name, 'username']} noStyle>
                          <Input type='hidden'/>
                        </Form.Item>
                        <Row style={{ marginBottom: '24px' }}>
                          <Col xl={4} style={{
                            textAlign: 'right',
                            fontSize: '14px',
                            color: 'rgba(0, 0, 0, 0.85)',
                          }}>脚本（{planScriptListIndex + 1}）：</Col>

                          <Col xl={16} style={{ textAlign: 'right' }}>
                            <MinusCircleOutlined
                              style={{ fontSize: '24px' }}
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(planScriptListField.name);
                                plan.planScriptList = form.getFieldValue('planScriptList');
                              }}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: '24px' }}>
                          <Col xl={4} style={{
                            textAlign: 'right',
                            fontSize: '14px',
                            color: 'rgba(0, 0, 0, 0.85)',
                          }}>添加者：</Col>
                          <Col xl={16} style={{ textAlign: 'left' }}>
                            {planScriptListField.record.username}
                          </Col>
                        </Row>
                        <Form.Item
                          label='内容'
                          name={[planScriptListField.name, 'text']}
                        >
                          <Input.TextArea placeholder={`脚本内容`} rows={10}/>
                        </Form.Item>
                      </div>)
                    }

                    <Row style={{ marginBottom: '24px' }}>
                      <Col push={4} xl={16}>
                        <Form.Item>
                          <Button type="dashed"
                                  onClick={() => {
                                    add();
                                    let planScriptList = form.getFieldValue('planScriptList') as PlanScriptDto[];
                                    planScriptList = planScriptList.map((planScript: PlanScriptDto) => {
                                      if (planScript?.userId) {
                                        return planScript;
                                      }
                                      return {
                                        ...planScript,
                                        userId: localStorage.getItem(USER_KEY.USER_ID),
                                        username: localStorage.getItem(USER_KEY.USERNAME),
                                      };
                                    });
                                    plan.planScriptList = planScriptList;
                                    form.setFieldsValue({ 'planScriptList': planScriptList });
                                  }}
                                  style={{ width: '100%' }}>
                            <PlusOutlined/> 添加一项
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            </Form.List>
          </div>

          <Form.List name="planEnvList">
            {(fields, { add, remove }) => {
              if (fields.length === plan.planEnvList.length) {
                // eslint-disable-next-line no-unused-expressions
                plan.planEnvList?.forEach((planEnv, planEnvIndex) => {
                  fields[planEnvIndex].record = planEnv;
                });
              }
              return (
                <div>
                  <h2>选择环境</h2>
                  <Row>
                    <Col xl={4} style={{ textAlign: 'right', lineHeight: '24px' }}>
                    </Col>
                    <Col xl={16}>
                      <Select mode="multiple"
                              style={{ minWidth: '100%' }}
                              value={plan?.planEnvList.map(planEnv => planEnv.envId)}
                              onSelect={(values, option) => {
                                add();

                                // eslint-disable-next-line no-unused-expressions
                                plan.planEnvList?.push({
                                  envId: option?.type?.id,
                                  envName: option?.type?.name,
                                  planEnvProjectConfigList: [{
                                    type: PlanEnvProjectConfigType.common.code,
                                    projectName: PlanEnvProjectConfigType.common.desc,
                                    projectId: 0,
                                    isEnableCustomConfig: true,
                                    projectSort: 0,
                                  }],
                                } as PlanEnvDto);


                                // 项目选择时，每个环境都要添加上，这里的代码比较容易出错，到时候看怎么优化
                                // @ts-ignore
                                checkBoxProjectListRef.current?.state?.value.forEach((projectId: any) => {
                                  if (projectId !== 0) {

                                    const planProjectSort = planProjectSortList.filter(value => value.projectId === projectId)[0];

                                    plan.planEnvList.filter(value => value.envId === option?.type.id)[0].planEnvProjectConfigList.push({
                                      type: PlanEnvProjectConfigType.project.code,
                                      projectId: planProjectSort.projectId,
                                      projectName: planProjectSort.projectName,
                                      projectSort: planProjectSort.sort,
                                      isEnableCustomConfig: false,
                                    });
                                  }
                                });
                                // 使用setFieldsValue 替换整个字段初始化内容
                                form.setFieldsValue({
                                  'planEnvList': plan.planEnvList,
                                });

                              }}
                      >
                        {
                          selectEnvListUseRequest.data?.result?.map(envDto => <Select.Option
                            disabled={plan?.planEnvList.map(planEnv => planEnv.envId)?.indexOf(envDto.id as number) !== -1}
                            value={envDto?.id as number}
                            key={envDto?.code}
                            type={envDto}>{envDto?.name}</Select.Option>)
                        }
                      </Select>


                    </Col>
                  </Row>
                  {
                    fields.map((planEnvListField, planEnvListIndex) => (
                      <div key={`envListField_${planEnvListIndex}`}>
                        <Row style={{ marginBottom: '24px', paddingTop: '30px' }}>
                          <Col xl={4}>
                            <h3>&nbsp;&nbsp;&nbsp;&nbsp;{planEnvListField?.record?.envName}</h3>
                          </Col>
                          <Col xl={16} style={{ textAlign: 'right' }}>
                            <MinusCircleOutlined
                              style={{ fontSize: '24px' }}
                              className="dynamic-delete-button"
                              onClick={() => {
                                remove(planEnvListField.name);
                                plan.planEnvList.splice(planEnvListField.name, 1);
                              }}
                            />
                          </Col>
                        </Row>

                        <Form.List name={[planEnvListField.name, 'planEnvProjectConfigList']}>
                          {(fields, { add, remove }) => {
                            const planEnvProjectConfigList: PlanEnvProjectConfigDto[] = form.getFieldValue(['planEnvList', planEnvListField.name, 'planEnvProjectConfigList']);
                            planEnvProjectConfigList.forEach((planEnvProjectConfig, planEnvProjectConfigIndex) => fields[planEnvProjectConfigIndex].record = planEnvProjectConfig);
                            // @ts-ignore
                            return (
                              <div>
                                {
                                  fields.map((planEnvProjectConfigListField, planEnvProjectConfigListIndex) =>
                                    <div
                                      key={uuid()}>
                                      <Row>
                                        <Col xl={8}>
                                          <h4>&nbsp;&nbsp;&nbsp;&nbsp;{planEnvProjectConfigListField.record.projectName}</h4>
                                        </Col>
                                        {
                                          planEnvProjectConfigListField.record.projectId === 0 ? '' :
                                            <Col xl={12} style={{ textAlign: 'right' }}>
                                              <Switch checkedChildren="关闭自定义配置" unCheckedChildren="开启自定义配置"
                                                      checked={plan.planEnvList[planEnvListIndex]?.planEnvProjectConfigList[planEnvProjectConfigListIndex]?.isEnableCustomConfig}
                                                      onChange={(checked) => {
                                                        plan.planEnvList = form.getFieldValue('planEnvList');
                                                        if (!plan.planEnvList) {
                                                          plan.planEnvList = [];
                                                        }
                                                        plan.planEnvList[planEnvListIndex].planEnvProjectConfigList[planEnvProjectConfigListIndex].isEnableCustomConfig = checked;
                                                        form.setFieldsValue({
                                                          'planEnvList': plan.planEnvList,
                                                        });
                                                      }}/>
                                            </Col>
                                        }
                                      </Row>
                                      <div
                                        style={{ display: plan?.planEnvList[planEnvListIndex]?.planEnvProjectConfigList[planEnvProjectConfigListIndex]?.isEnableCustomConfig ? 'block' : 'none' }}
                                      >
                                        <Form.Item label="发布分支"
                                                   name={[planEnvProjectConfigListField.name, 'publishBranch']}
                                        >
                                          <Input/>
                                        </Form.Item>
                                        <Form.Item
                                          label="发布服务器"
                                          name={[planEnvProjectConfigListField.name, 'publishServerId']}

                                        >
                                          <Radio.Group>
                                            {
                                              serverListUseRequest?.data?.result?.map((server) => {
                                                return <Radio value={server.id}
                                                              key={uuid()}>{server.name}-{server.ip}</Radio>;
                                              })
                                            }
                                          </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                          label="灰度版服务器"
                                          name={[planEnvProjectConfigListField.name, 'grayServerIdList']}
                                        >
                                          <Checkbox.Group
                                            options={serverListUseRequest?.data?.result?.map(server => ({
                                              label: `${server.name}-${server.ip}`,
                                              value: server.id as number,
                                            }))}
                                          />

                                        </Form.Item>

                                        <Form.Item
                                          label="正式版服务器"
                                          name={[planEnvProjectConfigListField.name, 'releaseServerIdList']}
                                        >
                                          <Checkbox.Group
                                            options={serverListUseRequest?.data?.result?.map(server => ({
                                              label: `${server.name}-${server.ip}`,
                                              value: server.id as number,
                                            }))}
                                          />

                                        </Form.Item>

                                        <Form.Item
                                          label="注册中心"
                                          name={[planEnvProjectConfigListField.name, 'registerCenterName']}
                                        >
                                          <Radio.Group>
                                            {
                                              pluginListUseResult?.data?.result?.map((plugin: any) => {
                                                return <Radio value={plugin.name} key={uuid()}>{plugin.name}</Radio>;
                                              })
                                            }
                                          </Radio.Group>
                                        </Form.Item>
                                      </div>
                                    </div>)
                                }
                              </div>
                            );
                          }}
                        </Form.List>
                      </div>
                    ))
                  }
                </div>
              );
            }}
          </Form.List>

          <Form.Item label=' ' colon={false} style={{ marginTop: '10vh' }}>
            <Button type="primary" htmlType="submit" block
                    loading={formUpdateUseRequest.loading || formSaveUseRequest.loading}>
              提交
            </Button>
          </Form.Item>
          {
            plan?.id ?
              <Form.Item label=' ' colon={false} style={{ marginTop: '20vh' }}>
                <Button danger block onClick={() => {
                }}>
                  删除版本计划（谨慎操作）
                </Button>
              </Form.Item>
              :
              ''
          }
        </Form>
      </Content>
    </Layout>
  );
}
