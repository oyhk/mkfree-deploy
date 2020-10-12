import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table/lib/Table';
import { Table, Button, notification, Modal, Row, Col, Checkbox, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import styles from '@/pages/project/project-index.less';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { momentFormat, uuid } from '@/utils/utils';
import { ProjectDto } from '@/services/dto/ProjectDto';
import { ProjectEnvServerDto } from '@/services/dto/ProjectEnvServerDto';
import routes from '@/routes';
import { ProjectEnvDto } from '@/services/dto/ProjectEnvDto';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { PageResult } from '@/services/PageResult';
import { BaseDto } from '@/services/dto/BaseDto';

export default () => {

  const [dynamicPublishProject, setDynamicPublishProject] = useState<{ visible: boolean, projectEnvServerList?: Array<ProjectEnvServerDto>, id?: number, name?: string, envId?: number, envName?: string }>({
    visible: false,
  });

  const [dynamicPublishProjectForm] = Form.useForm();

  // 分页数据
  const pageResultUseRequest = useRequest<ApiResult<PageResult<ProjectDto>>>(
    (params) => {
      return routes.apiRoutes.projectPage({
        pageNo: params.current,
        pageSize: params.pageSize,
        name: params.filters?.name,
      });
    },
    {
      manual: false,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      refreshOnWindowFocus: false,
      paginated: true,
    });


  //刷新项目分支
  const refreshBranchUseRequest = useRequest<ApiResult<BaseDto>>(
    (payload) => routes.apiRoutes.projectRefreshBranch(payload),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `项目：${params[0].name}`,
            description: '刷新分支操作成功，请稍后...',
          });
        }
      },
      fetchKey: (payload) => payload.id,
      manual: true,
      refreshOnWindowFocus: false,
    });

  //刷新项目分支
  const initUseRequest = useRequest<ApiResult<BaseDto>>(
    (payload) => routes.apiRoutes.projectInit(payload),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `项目：${params[0].name}`,
            description: '初始化操作成功，请稍后...',
          });
        }
      },
      fetchKey: (payload) => payload.id,
      manual: true,
      refreshOnWindowFocus: false,
    });

  const buildUseRequest = useRequest<ApiResult<BaseDto>>(
    (payload) => routes.apiRoutes.projectBuild(payload),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `项目：${params[0].name}`,
            description: '构建操作成功，请稍后...',
          });
        }
      },
      fetchKey: (payload) => `${payload.id}${payload.projectEnvServerId}`,
      manual: true,
      refreshOnWindowFocus: false,
    });

  const syncUseRequest = useRequest<ApiResult<BaseDto>>(
    (payload) => routes.apiRoutes.projectSync(payload),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `项目：${params[0].name}`,
            description: '同步操作成功，请稍后...',
          });
        }
      },
      fetchKey: (payload) => `${payload.id}${payload.projectEnvServerId}`,
      manual: true,
      refreshOnWindowFocus: false,
    });

  const projectEnvServerListUseRequest = useRequest<ApiResult<ProjectEnvServerDto[]>>(
    (payload) => routes.apiRoutes.projectEnvServerList(payload),
    {
      onSuccess: (ar, params) => {

        ar?.result?.forEach((pes: ProjectEnvServerDto) => {
          pes.isSelectServerIp = pes.isPublish;
        });
        const dynamicPublishProjectTemp = {
          id: params[0].projectId,
          name: params[0].projectName,
          envId: params[0].envId,
          envName: params[0].envName,
          visible: true,
          projectEnvServerList: ar.result,
        };
        setDynamicPublishProject(dynamicPublishProjectTemp);
        dynamicPublishProjectForm.setFieldsValue(dynamicPublishProjectTemp);
        return ar;
      },
      fetchKey: (payload) => `${payload.projectId}${payload.envId}`,
      manual: true,
      refreshOnWindowFocus: false,
    });

  const dynamicPublishUseRequest = useRequest<ApiResult<BaseDto>>(
    (payload) => routes.apiRoutes.projectDynamicPublish(payload),
    {
      onSuccess: (ar, params) => {
        if (ar) {
          notification.success({
            message: `项目：${params[0].name}`,
            description: '动态部署操作成功，请稍后...',
          });
          setDynamicPublishProject({ visible: false });
        }
      },
      manual: true,
      refreshOnWindowFocus: false,
    });


  if (!pageResultUseRequest.data) {
    return <PageLoading/>;
  }

  return (
    <PageHeaderWrapper
    >
      <ProTable<ProjectDto>
        toolBarRender={() => [
          <Link to={routes.pageRoutes.projectCreate}><PlusOutlined/> 添加项目</Link>,
        ]}
        pagination={{
          pageSize: 10,
          defaultPageSize: 10,
          current: 1,
          total: pageResultUseRequest.data.result.total,
          onChange: (current) => {
            pageResultUseRequest.params[0].current = current > 1 ? (current - 1) * pageResultUseRequest.params[0].pageSize + 1 : 1;
            pageResultUseRequest.run(pageResultUseRequest.params[0]);
          },
          onShowSizeChange: (current, pageSize) => {
            pageResultUseRequest.params[0].current = current > 1 ? (current - 1) * pageResultUseRequest.params[0].pageSize + 1 : 1;
            pageResultUseRequest.params[0].pageSize = pageSize;
            pageResultUseRequest.run(pageResultUseRequest.params[0]);
          },
        }}
        search={{
          collapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => {
            return [
              <Button
                type='primary'
                key="searchText"
                onClick={() => {
                  pageResultUseRequest.params[0].current = 1;
                  pageResultUseRequest.run({
                    ...pageResultUseRequest.params[0],
                    filters: { name: form?.getFieldValue('name') },
                  });
                }}
              >
                {searchText}
              </Button>,
              <Button
                type='primary'
                key="resetText"
                onClick={() => {
                  form?.resetFields();
                }}
              >
                {resetText}
              </Button>,
            ];
          },
        }}
        rowKey='id'
        columns={[
          {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, row: ProjectDto) =>
              <Link to={routes.pageRoutes.projectEditParams(row.id)}
                    style={{ fontSize: '22px' }}>{row.name}</Link>
            ,
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'right',
            hideInSearch: true,
            render: (_: any, row: ProjectDto) =>
              <div className={styles.projectRowAction}>
                <Link to={routes.pageRoutes.projectEditParams(row.id)}>编辑</Link>&nbsp;&nbsp;
                <Button type='primary' size='small' onClick={() => {
                  const payload = {
                    id: row.id,
                    name: row.name,
                  };
                  console.log('refresh branch payload', payload);
                  refreshBranchUseRequest.run(payload);
                }}>刷新git分支</Button>&nbsp;&nbsp;
                <Button
                  type='primary' size='small'
                  onClick={() => {
                    const payload = {
                      id: row.id,
                      name: row.name,
                    };
                    console.log('init payload', payload);
                    initUseRequest.run(payload);
                  }}>{row.state === 2 ? '重新初始化项目' : '初始化项目'}</Button>&nbsp;&nbsp;
              </div>
            ,
          },
        ]}
        dataSource={pageResultUseRequest.data?.result?.data}
        expandable={
          {
            expandedRowRender: (record) => {
              const subDataSource: any[] = [];
              // eslint-disable-next-line no-unused-expressions
              record.projectEnvList?.forEach(projectEnvDto => {
                subDataSource.push({
                  key: uuid(),
                  envId: projectEnvDto.envId,
                  envName: projectEnvDto.envName,
                  ip: projectEnvDto.projectEnvServerList,
                  publishTime: projectEnvDto.projectEnvServerList,
                  publishVersion: projectEnvDto.projectEnvServerList,
                  DevOps: projectEnvDto,
                  operations: projectEnvDto,
                });
              });
              return <Table
                columns={[
                  { title: '环境', dataIndex: 'envName', key: 'envName' },
                  {
                    title: 'ip', dataIndex: 'ip', key: 'ip',
                    render: (projectEnvServerList: ProjectEnvServerDto[]) => (
                      <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
                        <span className={styles.ipRow}
                              key={`${pes.id}_${pes.envId}_${pes.serverIp}_span`}>{pes.serverName}_{pes.serverIp}<br
                          key={`${pes.id}_${pes.envId}_${pes.serverIp}_br`}/></span>)) : ''}</div>
                    ),
                  },
                  {
                    title: '发布时间', dataIndex: 'publishTime', key: 'publishTime',
                    render: (projectEnvServerList: ProjectEnvServerDto[]) => (
                      <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
                        <span className={styles.ipRow}
                              key={`${pes.id}_${pes.envId}_${pes?.publishTime}`}>{momentFormat(pes?.publishTime)}<br/></span>)) : ''}</div>
                    ),
                  },
                  {
                    title: '服务器运行版本', dataIndex: 'publishVersion', key: 'publishVersion',
                    render: (projectEnvServerList: ProjectEnvServerDto[]) => (
                      <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
                        <span className={styles.ipRow}
                              key={`${pes.id}_${pes.envId}_${pes.publishVersion}`}>{pes.publishVersion}<br/></span>)) : ''}</div>
                    ),
                  },
                  {
                    title: 'DevOps',
                    dataIndex: 'DevOps',
                    key: 'DevOps',
                    render: (projectEnv: ProjectEnvDto) => {
                      return (
                        <div>
                          {
                            projectEnv?.projectEnvServerList ? projectEnv?.projectEnvServerList.map((pes) => (
                              <div className={styles.ipRow} key={uuid()}>
                                {
                                  pes.isPublish ?
                                    <Button
                                      type='primary'
                                      size='small'
                                      onClick={() => {
                                        const payload = {
                                          id: pes.projectId,
                                          name: pes.projectName,
                                          projectEnvServerId: pes.serverId,
                                          envId: pes.envId,
                                        };
                                        console.log('build payload', payload);
                                        buildUseRequest.run(payload);
                                      }}
                                      loading={buildUseRequest.fetches[`${pes.projectId}${pes.id}`]?.loading}
                                    >发布</Button> :
                                    <Button
                                      danger
                                      size='small'
                                      onClick={() => {
                                        const payload = {
                                          id: pes.projectId,
                                          name: pes.projectName,
                                          projectEnvServerId: pes.serverId,
                                          envId: pes.envId,
                                          syncServerId: projectEnv.syncServerId,
                                        };
                                        console.log('sync payload', payload);
                                        syncUseRequest.run(payload);
                                      }}
                                      loading={syncUseRequest.fetches[`${pes.projectId}${pes.id}`]?.loading}
                                    >从服务器同步</Button>
                                }
                              </div>
                            )) : <div/>
                          }
                        </div>
                      );
                    },
                  },
                  {
                    title: '操作',
                    dataIndex: 'operations',
                    key: 'operations',
                    render: (projectEnvDto: ProjectEnvDto) => {
                      return <div>
                        <Link
                          to={`${routes.pageRoutes.projectEnvLogInfoParams(projectEnvDto.projectId, projectEnvDto.envId)}`}
                          target='_blank'>查看日志</Link>&nbsp;&nbsp;
                        <Button
                          type='primary'
                          size='small'
                          loading={projectEnvServerListUseRequest.fetches[`${projectEnvDto.projectId}${projectEnvDto.envId}`]?.loading}
                          onClick={() => {
                            projectEnvServerListUseRequest.run({
                              projectId: projectEnvDto.projectId,
                              projectName: projectEnvDto.projectName,
                              envId: projectEnvDto.envId,
                              envName: projectEnvDto.envName,
                            });
                          }}
                        >动态发布</Button>&nbsp;&nbsp;
                      </div>;
                    },
                  },
                ]}
                dataSource={subDataSource}
                pagination={false}
                footer={() => <div/>}/>;
            },
            defaultExpandAllRows: true,
          }
        }

      />

      <Modal
        title={`项目：${dynamicPublishProject.name} 环境：${dynamicPublishProject.envName} 动态部署`}
        width={'80%'}
        visible={dynamicPublishProject.visible}
        footer={null}
        onOk={() => {
          setDynamicPublishProject({ visible: false });
        }}
        onCancel={() => {
          setDynamicPublishProject({ visible: false });
        }}
      >

        <Form
          form={dynamicPublishProjectForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(payload) => {
            console.log('project dynamic publish payload : ', payload);
            dynamicPublishUseRequest.run(payload);
          }}
        >
          <Form.Item name='id' hidden={true}>
            <Input/>
          </Form.Item>
          <Form.Item name='name' hidden={true}>
            <Input/>
          </Form.Item>
          <Form.Item name='envId' hidden={true}>
            <Input/>
          </Form.Item>
          <Form.List name={'projectEnvServerList'}>
            {
              (fields) =>
                <div>
                  {fields.map((projectEnvServiceField, projectEnvServerListIndex) => {
                    const projectEnvServer = dynamicPublishProjectForm.getFieldValue(['projectEnvServerList', projectEnvServiceField.name]);
                    return (
                      <Row style={{ lineHeight: '32px' }} key={uuid()}>
                        {
                          projectEnvServerListIndex === 0 ?
                            <Col xl={4}
                                 style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>
                              选择服务器：
                            </Col> : <Col xl={4}/>
                        }
                        <Col xl={16}>
                          <Form.Item
                            name={[projectEnvServiceField.name, 'isSelectServerIp']}
                            valuePropName='checked'
                          >
                            <Checkbox
                              disabled={projectEnvServer.isPublish}>
                              {projectEnvServer.serverName}-{projectEnvServer.serverIp}{projectEnvServer.isPublish ?
                              <span style={{ color: 'red' }}>（发布服务器）</span> : ''}</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
            }
          </Form.List>
          <Form.Item label=' ' colon={false}>
            <Button type="primary" htmlType="submit" block loading={dynamicPublishUseRequest.loading}>
              提交任务
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </PageHeaderWrapper>
  );
}

