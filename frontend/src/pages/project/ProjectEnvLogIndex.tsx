import React from 'react';
import { Col, Layout, Menu, Row, Select } from 'antd';
import { connect, Link, history, useParams } from 'umi';
import { MailOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons';
import routes from '@/routes';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { ProjectEnvLogModelState } from '@/pages/project/models/ProjectEnvLogModel';

const { Sider, Content, Header } = Layout;

export interface ProjectEnvLogPageProps {
  projectEnvLog: ProjectEnvLogModelState;
}

interface ProjectEnvLogPageUrlParams {
  projectId: string;
  envId: string;
  seq: string;
}

const ProjectEnvLogIndex: React.FC<ProjectEnvLogPageProps> = props => {
  const state = props.projectEnvLog;

  const historyLogMenu = props.projectEnvLog?.historyLogList?.map((projectEnvLog) => {
    return <Menu.Item key={projectEnvLog.projectEnvLogSeq}>
      <Link
        to={routes.pageRoutes.projectEnvLogInfoParams(projectEnvLog.projectId, projectEnvLog.envId, projectEnvLog.projectEnvLogSeq)}>
        #{projectEnvLog.projectEnvLogSeq}
      </Link>
    </Menu.Item>;
  });

  const buildingLogMenu = props.projectEnvLog?.buildingLogList?.map((projectEnvLog) => {
    return <Menu.Item key={projectEnvLog.projectEnvLogSeq}>
      <Link
        to={routes.pageRoutes.projectEnvLogInfoParams(projectEnvLog.projectId, projectEnvLog.envId, projectEnvLog.projectEnvLogSeq)}>
        #{projectEnvLog.projectEnvLogSeq}
      </Link>
    </Menu.Item>;
  });

  return (
    <PageHeaderWrapper
      title={`项目：${state.info?.projectName}`}
    >
      <Layout>
        <Sider theme='light'

        >
          <Row justify={'center'} style={{ padding: '30px' }}>
            <Select defaultValue={(useParams() as ProjectEnvLogPageUrlParams).envId} style={{ width: '120px' }}
                    onChange={(value, option) => {
                      // @ts-ignore
                      const projectEnvLogPageUrlParams = option?.prop as ProjectEnvLogPageUrlParams;
                      history.replace(routes.pageRoutes.projectEnvLogInfoParams(projectEnvLogPageUrlParams.projectId, projectEnvLogPageUrlParams.envId));
                    }}
            >
              {
                state?.projectEnvList?.map(projectEnv => <Select.Option key={projectEnv.id}
                                                                        prop={{
                                                                          projectId: projectEnv.projectId,
                                                                          envId: projectEnv.envId,
                                                                        }}
                                                                        value={`${projectEnv?.envId}`}>{projectEnv.envName}</Select.Option>)
              }
            </Select>
          </Row>
          <Menu
            defaultOpenKeys={['building', 'history']}
            defaultSelectedKeys={[(useParams() as ProjectEnvLogPageUrlParams).seq]}
            mode="inline"
            theme='light'
          >
            <Menu.SubMenu
              key="building"
              title={
                props.projectEnvLog?.buildingLogList ?
                  <div><LoadingOutlined/>正在构建（{props.projectEnvLog?.buildingLogList?.length} 个）</div> :
                  <div>正在构建（无）</div>
              }
            >
              {buildingLogMenu}
            </Menu.SubMenu>
            <Menu.SubMenu
              key="history"
              title={<span><FileOutlined/><span>历史构建日志</span></span>}
            >
              {historyLogMenu}
            </Menu.SubMenu>
          </Menu>
        </Sider>
        {
          state?.info ?
            <Layout>
              <Header style={{ padding: '0 20px',height:'auto' }}>
                <Row>
                  <Col sm={12}>时间：{state.info?.createdAt}</Col>
                  <Col sm={12}>类型：{state.info?.typeDesc}</Col>

                </Row>
                <Row>
                  <Col sm={12}>服务器：{state.info?.serverIp}</Col>
                  <Col sm={12}>版本：{state.info?.publishVersion}</Col>
                </Row>
              </Header>
              <Content>
                <div style={{ wordWrap: 'break-word', padding: '20px 20px 10px 20px' }}
                     dangerouslySetInnerHTML={{ __html: state?.info?.text?.toString() }}/>
                {
                  !state?.info?.isFinish
                    ? <div style={{ padding: '0px 20px 10px 20px' }}>
                      <LoadingOutlined style={{ fontSize: '20px' }}/>
                    </div>
                    : ''
                }
              </Content>
            </Layout>
            : (!state?.info && !state.historyLogList) ?
            <div style={{ width: '100%', textAlign: 'center' }}>无构建日志</div> :
            <PageLoading/>
        }
      </Layout>
    </PageHeaderWrapper>
  );
};
export default connect(({ projectEnvLog }: ProjectEnvLogPageProps) => ({ projectEnvLog }))(ProjectEnvLogIndex);
