import React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  Radio,
  Row,
  Col,
  Checkbox,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { uuid } from '@/utils/utils';
import { ServerDto } from '@/models/dto/ServerDto';
import { ProjectPageProps } from '@/pages/project/ProjectPageProps';
import { PageLoading } from '@ant-design/pro-layout';

const { Option } = Select;

const ProjectForm: React.FC<ProjectPageProps> = ({ project, isCreate, dispatch }) => {


  const [form] = Form.useForm();
  const projectState = project?.project;
  if (!projectState) {
    return <PageLoading/>;
  }
  if (!dispatch) {
    return <div/>;
  }
  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      initialValues={projectState}
      onFinish={(projectDto) => {
        if (projectDto.id && !isCreate) {
          dispatch({
            type: 'project/update',
            payload: projectDto,
          });
        }else{
          dispatch({
            type: 'project/saved',
            payload: projectDto,
          });
        }


      }}
    >
      <div>
        <Form.Item name='id'>
          <Input type='hidden'/>
        </Form.Item>
        <h2>基本信息</h2>
        <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '必填' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="git仓库地址" name="gitUrl" rules={[{ required: true, message: '必填' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="远程服务器项目路劲" name="remotePath" rules={[{ required: true, message: '必填' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="项目模块名称" name="moduleName" rules={[{ required: true, message: '必填' }]}>
          <Input/>
        </Form.Item>
      </div>
      <div>
        <h2>部署文件</h2>
        <Form.List name="projectDeployFileList">
          {(fields, { add, remove }) => {
            /**
             * `fields` internal fill with `name`, `key`, `fieldKey` props.
             * You can extends this into sub field to support multiple dynamic fields.
             */
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={`${field.name}_${field.key}`}>
                    <Row style={{ marginBottom: '24px' }}>
                      <Col xl={4} style={{
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'rgba(0, 0, 0, 0.85)',
                      }}>文件（{index + 1}）：</Col>
                      <Col xl={16} style={{ textAlign: 'right' }}>
                        <MinusCircleOutlined
                          style={{ fontSize: '14px' }}
                          className="dynamic-delete-button"
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      </Col>
                    </Row>
                    <Form.Item
                      label="本地服务器文件路径"
                      name={[field.name, 'localFilePath']}
                      fieldKey={[field.fieldKey, 'localFilePath']}
                    >
                      <Input placeholder="路径为相对路径"/>
                    </Form.Item>


                    <Form.Item
                      label='远程服务器文件路径'
                      name={[field.name, 'remoteFilePath']}
                      fieldKey={[field.fieldKey, 'remoteFilePath']}
                    >
                      <Input placeholder="路径为相对路径"/>
                    </Form.Item>
                    <Form.Item
                      label='状态'
                      name={[field.name, 'isEnable']}
                      fieldKey={[field.fieldKey, 'isEnable']}
                      valuePropName='checked'
                    >
                      <Switch checkedChildren="启用" unCheckedChildren="关闭"/>
                    </Form.Item>

                  </div>
                ))}

                <Row style={{ marginBottom: '24px' }}>
                  <Col push={4} xl={16}>
                    <Form.Item>
                      <Button type="dashed" onClick={() => {
                        add();
                      }} style={{ width: '100%' }}>
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
      {/* ----------------------------------------------------------------环境配置------------------------------------------------------------------------ */}
      <Form.List name='projectEnvList'>
        {(fields, { add, remove }) => {
          projectState.projectEnvList?.forEach((projectEnvDto, projectEnvDtoIndex) => {
            if (fields[projectEnvDtoIndex]) {
              fields[projectEnvDtoIndex].record = projectEnvDto;
            }
          });
          // ant design Form.List 里暂无提供 record 字段，这里暂时扩展支持
          // 已经选中的环境Id列表
          const selectedEnvIdList = fields.map((projectEnvListField) => projectEnvListField?.record?.envId);
          return (
            <div>
              <Row>
                <Col xl={4}><h2>环境配置</h2></Col>
                <Col xl={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
                  <h4 style={{ display: 'inline' }}>选择环境：</h4>
                </Col>
                <Col xl={12}>
                  <Form.Item noStyle>
                    <Select mode="multiple"
                            value={projectState?.projectEnvList?.map((env) => env.envId)}
                            style={{ minWidth: '100%' }}
                            onSelect={(envId, option) => {
                              // 这里一定要注意，一定要执行add()方法，不然会多一个Form.List的item
                              add();

                              const projectEnvServerList = project?.serverList?.map((server: ServerDto) => {
                                return {
                                  envId: server.envId,
                                  envName: server.envName,
                                  serverIp: server.ip,
                                  serverName: server.name,
                                };
                              });
                              projectState?.projectEnvList.push({
                                envId: envId as number,
                                envName: option.children,
                                projectEnvServerList,
                              });

                              // 使用setFieldsValue 替换整个字段初始化内容
                              form.setFieldsValue({
                                'projectEnvList': projectState?.projectEnvList,
                              });
                            }}
                    >

                      {project?.envList?.map((env, envIndex) => {
                        return <Option value={env.id}
                                       disabled={selectedEnvIdList?.indexOf(env.id as number) !== -1}
                                       key={`env_${envIndex}`}>{env.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {fields.map((projectEnvListField) => (
                <div key={uuid()}>
                  <Row style={{ marginBottom: '24px' }}>
                    <Col xl={4} style={{ textAlign: 'center' }}>
                      <h3>{projectEnvListField?.record?.envName}</h3>
                    </Col>
                    <Col xl={16} style={{ textAlign: 'right' }}>
                      <MinusCircleOutlined
                        style={{ fontSize: '28px' }}
                        className="dynamic-delete-button"
                        onClick={() => {
                          remove(projectEnvListField.name);
                          // 同时删除projectState?.projectEnvList里的元素
                          dispatch({
                            type: 'project/editProjectEnvDel',
                            payload: { envId: projectEnvListField?.record?.envId },
                          });

                        }}
                      />
                    </Col>
                  </Row>
                  <Form.Item noStyle
                             name={[projectEnvListField.name, 'envId']}
                             fieldKey={[projectEnvListField.fieldKey, 'envId']}
                  >
                    <Input type='hidden'/>
                  </Form.Item>
                  <Form.Item
                    label="发布分支"
                    name={[projectEnvListField.name, 'publishBranch']}
                    fieldKey={[projectEnvListField.fieldKey, 'publishBranch']}
                  >
                    <Select>
                      <Option value="master">master</Option>
                    </Select>
                  </Form.Item>
                  <Form.List
                    name={[projectEnvListField.name, 'projectEnvServerList']}
                    fieldKey={[projectEnvListField.fieldKey, 'projectEnvServerList']}>
                    {(fields) => {

                      // ant design Form.List 里暂无提供 record 字段，这里暂时扩展支持
                      // eslint-disable-next-line no-unused-expressions
                      fields?.forEach((projectEnvServerField, projectEnvServerListIndex) => {
                        projectEnvServerField.record = projectEnvListField?.record?.projectEnvServerList[projectEnvServerListIndex];
                      });
                      return (
                        <div>
                          {fields.map((projectEnvServiceField, projectEnvServerListIndex) => (
                            <Row style={{ lineHeight: '32px' }} key={uuid()}>
                              {
                                projectEnvServerListIndex === 0 ?
                                  <Col xl={4}
                                       style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>
                                    选择服务器：
                                  </Col> : <Col xl={4}/>
                              }
                              <Col xl={8}>
                                <Form.Item
                                  name={[projectEnvServiceField.name, 'isSelectServerIp']}
                                  fieldKey={[projectEnvServiceField.fieldKey, 'isSelectServerIp']}
                                  valuePropName='checked'
                                >
                                  <Checkbox>{projectEnvServiceField?.record?.serverName}-{projectEnvServiceField?.record?.serverIp}</Checkbox>
                                </Form.Item>
                              </Col>
                              <Col xl={6}
                                   style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>
                                是否设置为发布服务器：
                              </Col>
                              <Col xl={2}>
                                <Form.Item
                                  name={[projectEnvServiceField.name, 'isPublish']}
                                  fieldKey={[projectEnvServiceField.fieldKey, 'isPublish']}
                                  valuePropName='checked'>
                                  <Switch checkedChildren="启用" unCheckedChildren="关闭"/>
                                </Form.Item>
                              </Col>
                            </Row>
                          ))}
                        </div>
                      );
                    }}
                  </Form.List>
                  <Form.Item
                    label="可选分支发布"
                    valuePropName='checked'
                    name={[projectEnvListField.name, 'isSelectBranch']}
                    fieldKey={[projectEnvListField.fieldKey, 'isSelectBranch']}>
                    <Switch checkedChildren="启用" unCheckedChildren="关闭"/>
                  </Form.Item>

                  <Form.Item
                    label="选择同步服务器"
                    name={[projectEnvListField.name, 'syncServerIp']}
                    fieldKey={[projectEnvListField.fieldKey, 'syncServerIp']}
                  >
                    <Radio.Group buttonStyle="solid">
                      {
                        project?.serverList?.map((server) => {
                          return <Radio.Button value={server.ip} key={uuid()}>{server.name}-{server.ip}</Radio.Button>;
                        })
                      }
                    </Radio.Group>
                  </Form.Item>
                  {/* 构建命令 */}
                  <Form.List
                    name={[projectEnvListField.name, 'projectCommandStepBuildList']}
                    fieldKey={[projectEnvListField.fieldKey, 'projectCommandStepBuildList']}
                  >
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          <Row style={{ marginBottom: '24px' }}>
                            <Col xl={4} style={{ textAlign: 'right' }}>
                              <h4>构建命令：</h4>
                            </Col>
                          </Row>
                          {fields.map((projectBuildBeforeListField, projectBuildBeforeListIndex) => (
                            <Row key={uuid()}>
                              <Col xl={4}
                                   style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)' }}>
                                （{projectBuildBeforeListIndex + 1}）：
                              </Col>
                              <Col xl={14}>
                                <Form.Item
                                  name={[projectBuildBeforeListField.name, 'step']}
                                  fieldKey={[projectBuildBeforeListField.fieldKey, 'step']}
                                >
                                  <Input.TextArea placeholder={`构建命令 shell 脚本 ${projectBuildBeforeListIndex + 1}`}/>
                                </Form.Item>
                              </Col>
                              <Col xl={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ fontSize: '14px' }}
                                  onClick={() => {
                                    remove(projectBuildBeforeListField.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          ))}
                          <Row style={{ marginBottom: '24px' }}>
                            <Col push={4} xl={16}>
                              <Form.Item>
                                <Button type="dashed" onClick={() => {
                                  add();
                                }} style={{ width: '100%' }}>
                                  <PlusOutlined/> 添加一项
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>);
                    }}
                  </Form.List>
                  {/* 构建后命令 */}
                  <Form.List
                    name={[projectEnvListField.name, 'projectCommandStepBuildAfterList']}
                    fieldKey={[projectEnvListField.fieldKey, 'projectCommandStepBuildAfterList']}
                  >
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          <Row style={{ marginBottom: '24px' }}>
                            <Col xl={4} style={{ textAlign: 'right' }}>
                              <h4>构建后命令：</h4>
                            </Col>
                          </Row>
                          {fields.map((projectBuildAfterListField, projectBuildAfterListIndex) => (
                            <Row key={uuid()}>
                              <Col xl={4}
                                   style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)' }}>
                                （{projectBuildAfterListIndex + 1}）：
                              </Col>
                              <Col xl={14}>
                                <Form.Item
                                  name={[projectBuildAfterListField.name, 'step']}
                                  fieldKey={[projectBuildAfterListField.fieldKey, 'step']}
                                >
                                  <Input.TextArea placeholder={`构建后命令 shell 脚本 ${projectBuildAfterListIndex + 1}`}/>
                                </Form.Item>
                              </Col>
                              <Col xl={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ fontSize: '14px' }}
                                  onClick={() => {
                                    remove(projectBuildAfterListField.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          ))}
                          <Row style={{ marginBottom: '24px' }}>
                            <Col push={4} xl={16}>
                              <Form.Item>
                                <Button type="dashed" onClick={() => {
                                  add();
                                }} style={{ width: '100%' }}>
                                  <PlusOutlined/> 添加一项
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>);
                    }}
                  </Form.List>
                  {/* 同步后命令 */}
                  <Form.List
                    name={[projectEnvListField.name, 'projectCommandStepSyncAfterList']}
                    fieldKey={[projectEnvListField.fieldKey, 'projectCommandStepSyncAfterList']}
                  >
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          <Row style={{ marginBottom: '24px' }}>
                            <Col xl={4} style={{ textAlign: 'right' }}>
                              <h4>同步后命令：</h4>
                            </Col>
                          </Row>
                          {fields.map((projectSyncAfterListField, projectSyncAfterListIndex) => (
                            <Row key={uuid()}>
                              <Col xl={4}
                                   style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)' }}>
                                （{projectSyncAfterListIndex + 1}）：
                              </Col>
                              <Col xl={14}>
                                <Form.Item
                                  name={[projectSyncAfterListField.name, 'step']}
                                  fieldKey={[projectSyncAfterListField.fieldKey, 'step']}
                                >
                                  <Input.TextArea placeholder={`同步后命令 shell 脚本 ${projectSyncAfterListIndex + 1}`}/>
                                </Form.Item>
                              </Col>
                              <Col xl={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ fontSize: '14px' }}
                                  onClick={() => {
                                    remove(projectSyncAfterListField.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          ))}
                          <Row style={{ marginBottom: '24px' }}>
                            <Col push={4} xl={16}>
                              <Form.Item>
                                <Button type="dashed" onClick={() => {
                                  add();
                                }} style={{ width: '100%' }}>
                                  <PlusOutlined/> 添加一项
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>);
                    }}
                  </Form.List>
                </div>
              ))}
            </div>
          );
        }}
      </Form.List>
      {/* ----------------------------------------------------------------环境配置------------------------------------------------------------------------ */}
      <Form.Item label=' ' colon={false} style={{marginTop:'10vh'}}>
        <Button type="primary" htmlType="submit" block>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ProjectForm;
