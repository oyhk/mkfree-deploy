import React, { useRef, useState } from 'react';
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
import { useRequest } from '@umijs/hooks';
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
  const [plan] = useState<PlanDto>(props.plan ? props.plan : { planEnvList: [], planScriptList: [] });


  const [selectEnvList, setSelectEnvList] = useState<EnvDto[]>([]);
  const [serverList, setServerList] = useState<ServerDto[]>([]);

  const [treeProjectList, setTreeProjectList] = useState();
  const treeProjectListRef = useRef();

  useRequest<ApiResult<PlanProjectSortDto[]>>(
    () => routes.apiRoutes.planProjectSortList(),
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          setTreeProjectList(apiResult.result?.map((planProjectSortDto: PlanProjectSortDto) => ({
            title: planProjectSortDto.projectName,
            key: planProjectSortDto.projectId,
            projectSort: planProjectSortDto.sort,
          })));
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  useRequest<ApiResult<EnvDto[]>>(
    () => routes.apiRoutes.envList,
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          setSelectEnvList(apiResult.result);
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  useRequest<ApiResult<ServerDto[]>>(
    () => routes.apiRoutes.serverList,
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          setServerList(apiResult.result);
        }
      },
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

  if (!serverList || serverList?.length === 0) {
    return <PageLoading/>;
  }
  if (!treeProjectList || treeProjectList?.length === 0) {
    return <PageLoading/>;
  }
  if (!selectEnvList || selectEnvList?.length === 0) {
    return <PageLoading/>;
  }


  return (
    <Layout>
      <Sider theme='light'
             width='21%'
      >
        <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Tree
            ref={treeProjectListRef}
            treeData={treeProjectList}
            defaultSelectedKeys={(plan.planEnvList.length > 0 ? plan.planEnvList[0].planEnvProjectConfigList?.map((planEnvProjectConfig: PlanEnvProjectConfigDto) => planEnvProjectConfig.projectId) : []) as number[]}
            multiple={true}
            onSelect={(selectedKeys, e) => {
              plan.planEnvList = form.getFieldValue('planEnvList');

              console.log('treeProjectList select change ', e.node);

              if (e.selected) {
                selectedKeys.forEach((projectId) => {
                  plan.planEnvList.forEach((planEnv) => {
                    const existProjectIdList = planEnv.planEnvProjectConfigList.map(planEnvProjectConfig => planEnvProjectConfig.projectId);
                    if (existProjectIdList.indexOf(projectId as number) === -1) {
                      planEnv.planEnvProjectConfigList.push({
                        projectId: projectId as number,
                        projectName: e.node.title as string,
                        projectSort: e.node.projectSort,
                        type: PlanEnvProjectConfigType.project.code,
                        isEnableCustomConfig: false,
                      });
                    }
                  });
                });
              } else {
                plan.planEnvList.forEach((planEnv) => {
                  // 0 是公共配置，所以要保留
                  planEnv.planEnvProjectConfigList = planEnv.planEnvProjectConfigList.filter(value => (selectedKeys.indexOf(value.projectId as number) > -1) || value.projectId === 0);
                });
              }

              // 使用setFieldsValue 替换整个字段初始化内容
              form.setFieldsValue({
                'planEnvList': plan.planEnvList,
              });


            }}
          />
        </Row>
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
                          <Input.TextArea placeholder={`脚本内容`} rows="10"/>
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
                                // eslint-disable-next-line no-unused-expressions
                                treeProjectListRef.current?.state?.selectedKeys.forEach((projectId: any) => {
                                  if (projectId !== 0) {
                                    plan.planEnvList.filter(value => value.envId === option?.type.id)[0].planEnvProjectConfigList.push({
                                      type: PlanEnvProjectConfigType.project.code,
                                      projectId: treeProjectListRef.current?.state.keyEntities[projectId].node.key,
                                      projectName: treeProjectListRef.current?.state.keyEntities[projectId].node.title,
                                      projectSort: treeProjectListRef.current?.state.keyEntities[projectId].node.projectSort,
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
                          selectEnvList?.map(envDto => <Select.Option
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
                                              serverList.map((server) => {
                                                return <Radio value={server.id}
                                                              key={uuid()}>{server.name}-{server.ip}</Radio>;
                                              })
                                            }
                                          </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                          label="灰度版服务器"
                                          name={[planEnvProjectConfigListField.name, 'garyServerIdList']}
                                        >
                                          <Checkbox.Group
                                            options={serverList.map(server => ({
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
                                            options={serverList.map(server => ({
                                              label: `${server.name}-${server.ip}`,
                                              value: server.id as number,
                                            }))}
                                          />

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
                <Button type="danger" block onClick={() => {
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
