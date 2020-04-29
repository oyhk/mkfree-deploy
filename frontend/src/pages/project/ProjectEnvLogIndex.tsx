import React from 'react';
import { Col, Layout, Menu, Row, Select } from 'antd';
import { connect, Link, useRouteMatch, useParams } from 'umi';
import { MailOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons';
import routes from '@/routes';
import { ProjectEnvLogPageProps } from '@/pages/project/ProjectEnvLogInfo';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';

const { Sider, Content, Header } = Layout;

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
            <Select defaultValue="1">
              <Select.Option value="4">DEV环境</Select.Option>
              <Select.Option value="1">UAT环境</Select.Option>
            </Select>
          </Row>
          <Menu
            defaultOpenKeys={['building', 'history']}
            defaultSelectedKeys={[(useParams() as { seq: string }).seq]}
            mode="inline"
            theme='light'
          >
            <Menu.SubMenu
              key="building"
              title={
                props.projectEnvLog?.buildingLogList?.length ?
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
          state.info ?
            <Content>
              <Header>
                <Row>
                  <Col></Col>
                </Row>
              </Header>
              <Content>
                <div style={{ wordWrap: 'break-word', padding: '20px 20px 10px 20px' }}
                     dangerouslySetInnerHTML={{ __html: state?.info?.text as string }}/>
                {
                  !state?.info?.isFinish
                    ? <div style={{ padding: '0px 20px 10px 20px' }}>
                      <LoadingOutlined style={{ fontSize: '20px' }}/>
                    </div>
                    : ''
                }
              </Content>
            </Content>
            :
            <PageLoading/>
        }
      </Layout>
    </PageHeaderWrapper>
  );
};
export default connect(({ projectEnvLog }: ProjectEnvLogPageProps) => ({ projectEnvLog }))(ProjectEnvLogIndex);
