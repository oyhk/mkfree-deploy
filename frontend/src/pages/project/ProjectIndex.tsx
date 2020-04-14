import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table/lib/Table';
import { Table, Button } from 'antd';
import {
  SmileTwoTone,
} from '@ant-design/icons';
import { connect, Link } from 'umi';
import styles from '@/pages/project/project-index.less';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { uuid } from '@/utils/utils';
import { ProjectDto } from '@/models/dto/ProjectDto';
import { ProjectEnvServerDto } from '@/models/dto/ProjectEnvServerDto';
import { ProjectPageProps } from '@/pages/project/ProjectPageProps';
import routes from '@/routes';


const columns: ProColumns<ProjectDto>[] = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (_, row: ProjectDto) => (
      <Link to={`/project/edit/${row.id}`}>{row.name}</Link>
    ),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    render: () => (
      <div className={styles.projectRowAction}>
        <Button type='primary' size='small' onClick={() => {
        }}>查看日志</Button>&nbsp;&nbsp;
      </div>
    ),
  },
];

const expandedRowRender = (projectDto: ProjectDto) => {
  if (!projectDto)
    return <PageLoading/>;

  const subColumns = [
    { title: '环境', dataIndex: 'envName', key: 'envName' },
    {
      title: 'ip', dataIndex: 'ip', key: 'ip',
      render: (projectEnvServerList: ProjectEnvServerDto[]) => (
        <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
          <span className={styles.ipRow} key={`${pes.id}_${pes.envId}_${pes.serverIp}_span`}>{pes.serverIp}<br
            key={`${pes.id}_${pes.envId}_${pes.serverIp}_br`}/></span>)) : ''}</div>
      ),
    },
    {
      title: '发布时间', dataIndex: 'publishTime', key: 'publishTime',
      render: (projectEnvServerList: ProjectEnvServerDto[]) => (
        <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
          <span className={styles.ipRow}
                key={`${pes.id}_${pes.envId}_${pes.publishTime}`}>{pes.publishTime}<br/></span>)) : ''}</div>
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
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (projectEnvServerList: ProjectEnvServerDto[]) => (
        <div>{projectEnvServerList ? projectEnvServerList.map((pes) => (
          <div className={styles.ipRow} key={`${pes.projectId}_${pes.id}_${pes.envId}_${pes.publishVersion}`}>
            {
              pes.isPublish ? <Button type='primary' size='small'>发布</Button> :
                <Button danger size='small'>从服务器同步</Button>
            }
            <br/>
          </div>
        )) : ''}</div>
      ),
    },
  ];


  const subDataSource: any[] = [];

  projectDto.projectEnvList?.forEach(({ envId, envName, projectEnvServerList }) => {
    subDataSource.push({
      key: uuid(),
      envId,
      envName,
      ip: projectEnvServerList,
      publishTime: projectEnvServerList,
      publishVersion: projectEnvServerList,
      operation: projectEnvServerList,
    });
  });

  return (
    <Table columns={subColumns} dataSource={subDataSource} pagination={false}/>
  );

};


const ProjectPage: React.FC<ProjectPageProps> = ({ project, dispatch }) => {
  if (!project?.page.data)
    return <PageLoading/>;

  return (
    <PageHeaderWrapper
    >
      <ProTable<ProjectDto> rowKey='id'
                            columns={columns}
                            dataSource={project?.page?.data}
                            search={false}
                            expandable={{
                              expandedRowRender, expandIcon: () => {
                                return <div className="icons-list">
                                  <SmileTwoTone className={styles.projectState}/>
                                  {/* <FrownTwoTone twoToneColor="#eyarn b2f96" className={styles.projectState}/> */}
                                </div>;
                              }, defaultExpandAllRows: true,
                            }}
                            pagination={false}
                            toolBarRender={() => [
                              <Link to={routes.pageRoutes.projectCreate}>添加</Link>,
                            ]}
      />

    </PageHeaderWrapper>
  );
};

export default connect(
  ({ project }: ProjectPageProps) => ({ project }),
)(ProjectPage);
