import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table/lib/Table';
import { Table, Button } from 'antd';
import {
  SmileTwoTone, PlusOutlined,
} from '@ant-design/icons';
import { connect, Link, Dispatch, useModel } from 'umi';
import styles from '@/pages/project/project-index.less';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { momentFormat, uuid } from '@/utils/utils';
import { ProjectDto } from '@/services/dto/ProjectDto';
import { ProjectEnvServerDto } from '@/services/dto/ProjectEnvServerDto';
import { ProjectPageProps } from '@/pages/project/ProjectPageProps';
import routes from '@/routes';
import { ProjectEnvDto } from '@/services/dto/ProjectEnvDto';
import PluginEurekaIndex from '@/pages/project/components/PluginEurekaIndex';


const expandedRowRender = (projectDto: ProjectDto, dispatch: Dispatch) => {
  if (!projectDto)
    return <PageLoading/>;

  const subColumns = [
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
          <span className={styles.ipRow} key={`${pes.id}_${pes.envId}_${pes.publishVersion}`}>{pes.publishVersion}<br/></span>)) : ''}</div>
      ),
    },
    {
      title: 'DevOps',
      dataIndex: 'DevOps',
      key: 'DevOps',
      render: (projectEnvServerList: ProjectEnvServerDto[]) => (
        <div>
          {
            projectEnvServerList ? projectEnvServerList.map((pes) => (
              <div className={styles.ipRow} key={uuid()}>
                {
                  pes.isPublish ? <Button type='primary' size='small' onClick={() => {

                    const payload = {
                      id: pes.projectId,
                      name: pes.projectName,
                      projectEnvServerId: pes.id,
                    };
                    console.log('build payload', payload);
                    dispatch({
                      type: 'project/build',
                      payload,
                    });
                  }}>发布</Button> : <Button danger size='small' onClick={() => {

                    const payload = {
                      id: pes.projectId,
                      name: pes.projectName,
                      projectEnvServerId: pes.id,
                    };
                    console.log('sync payload', payload);
                    dispatch({
                      type: 'project/sync',
                      payload,
                    });
                  }}>从服务器同步</Button>
                }
              </div>
            )) : <div/>
          }
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      render: (projectEnvDto: ProjectEnvDto) => {
        return <div>
          <Link to={`${routes.pageRoutes.projectEnvLogInfoParams(projectEnvDto.projectId, projectEnvDto.envId)}`}
                target='_blank'>查看日志</Link>&nbsp;&nbsp;
          <Button type='link'
                  onClick={() => {
                    dispatch({
                      type: 'pluginEureka/index',
                      payload: {
                        visible: true,
                        projectId: projectEnvDto.projectId,
                        projectName: projectEnvDto.projectName,
                        envId: projectEnvDto.envId,
                        envName: projectEnvDto.envName,
                      },
                    });
                  }}
                  target='_blank'>Eureka</Button>
        </div>;
      },
    },
  ];


  const subDataSource: any[] = [];

  // eslint-disable-next-line no-unused-expressions
  projectDto?.projectEnvList?.forEach(projectEnvDto => {
    subDataSource.push({
      key: uuid(),
      envId: projectEnvDto.envId,
      envName: projectEnvDto.envName,
      ip: projectEnvDto.projectEnvServerList,
      publishTime: projectEnvDto.projectEnvServerList,
      publishVersion: projectEnvDto.projectEnvServerList,
      DevOps: projectEnvDto.projectEnvServerList,
      operations: projectEnvDto,
    });
  });

  return (
    <Table columns={subColumns} dataSource={subDataSource} pagination={false} footer={() => <div/>}/>
  );

};


const ProjectPage: React.FC<ProjectPageProps> = ({ project, dispatch }) => {
  if (!dispatch)
    return <div/>;

  if (!project?.page?.data)
    return <PageLoading/>;

  return (
    <PageHeaderWrapper
    >
      <ProTable<ProjectDto> rowKey='id'
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
                                      dispatch({
                                        type: 'project/refreshBranch',
                                        payload,
                                      });
                                    }}>刷新git分支</Button>&nbsp;&nbsp;
                                    <Button type='primary' size='small' onClick={() => {
                                      const payload = {
                                        id: row.id,
                                        name: row.name,
                                      };
                                      console.log('init payload', payload);
                                      dispatch({
                                        type: 'project/init',
                                        payload,
                                      });
                                    }}>{row.state === 2 ? '重新初始化项目' : '初始化项目'}</Button>&nbsp;&nbsp;
                                  </div>
                                ,
                              },
                            ]}
                            dataSource={project?.page?.data}
                            search={false}
                            expandable={
                              {
                                expandedRowRender: (record) => {
                                  return expandedRowRender(record, dispatch);
                                },
                                defaultExpandAllRows: true,
                              }
                            }
                            pagination={false}
                            toolBarRender={() => [
                              <Link to={routes.pageRoutes.projectCreate}><PlusOutlined/> 添加项目</Link>,
                            ]}
      />
      <PluginEurekaIndex/>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({ project }: ProjectPageProps) => ({ project }),
)(ProjectPage);
