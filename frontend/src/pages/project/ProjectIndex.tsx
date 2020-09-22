import React from 'react';
import ProTable  from '@ant-design/pro-table/lib/Table';
import { Table, Button, notification } from 'antd';
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

  // 分页数据
  const pageResultUseRequest = useRequest<ApiResult<PageResult<ProjectDto>>>(
    () => routes.apiRoutes.projectPage({
      pageNo: 0,
      pageSize: 10000,
    }),
    {
      manual: false,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      refreshOnWindowFocus: false,
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

  if (!pageResultUseRequest.data) {
    return <PageLoading/>;
  }

  return (
    <PageHeaderWrapper
    >
      <ProTable<ProjectDto>
        rowKey='id'
        columns={[
          {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, row: ProjectDto) =>
              <Link to={routes.pageRoutes.projectEditParams(row.id)}
                    style={{ fontSize: '22px' }}>{row.name}</Link>
            ,
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'right',
            render: (_, row: ProjectDto) =>
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
        search={false}
        expandable={
          {
            expandedRowRender: (record) => {

              console.log('record', record);

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
                      console.log('projectEnv',projectEnv);
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
        pagination={false}
        toolBarRender={() => [
          <Link to={routes.pageRoutes.projectCreate}><PlusOutlined/> 添加项目</Link>,
        ]}
      />
    </PageHeaderWrapper>
  );
}

