import React from 'react';
import { Col, Layout, Menu, Row, Select } from 'antd';
import { Link, history, useParams } from 'umi';
import { LoadingOutlined, FileOutlined } from '@ant-design/icons';
import routes from '@/routes';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { momentFormat } from '@/utils/utils';
import { useRequest } from 'ahooks';
import { ApiResult } from '@/services/ApiResult';
import { ProjectDto } from '@/services/dto/ProjectDto';
import { ProjectEnvDto } from '@/services/dto/ProjectEnvDto';
import { ProjectEnvLogDto } from '@/services/dto/ProjectEnvLogDto';


const { Sider, Content, Header } = Layout;


interface ProjectEnvLogUrlParams {
  projectId: string,
  envId: string,
  seq: string,
};

export default (props: any) => {

  const urlParams = useParams<ProjectEnvLogUrlParams>();

  const projectInfoUseRequest = useRequest<ApiResult<ProjectDto>>(
    routes.apiRoutes.projectInfo({ id: urlParams.projectId })
    ,
    {
      ready: !!urlParams.projectId,
      manual: false,
      refreshOnWindowFocus: false,
    });

  const projectEnvListUseRequest = useRequest<ApiResult<ProjectEnvDto[]>>(
    routes.apiRoutes.projectEnvList({ projectId: urlParams.projectId })
    ,
    {
      ready: !!urlParams.projectId,
      manual: false,
      refreshOnWindowFocus: false,
    });

  const projectEnvLogListUseRequest = useRequest<ApiResult<ProjectEnvLogDto[]>>(
    routes.apiRoutes.projectEnvLogList({ projectId: urlParams.projectId, envId: urlParams.envId })
    ,
    {
      ready: !!urlParams.projectId && !!urlParams.envId,
      onSuccess: (ar) => {
        if (ar.result && !urlParams.seq) {
          props.history.replace(routes.pageRoutes.projectEnvLogInfoParams(urlParams.projectId, urlParams.envId, ar.result[0].projectEnvLogSeq));
          return;
        }
        return ar;
      },
      manual: false,
      pollingWhenHidden:false,
      pollingInterval: 1000,
      refreshOnWindowFocus: false,
    });


  const projectEnvLogInfoUseRequest = useRequest<ApiResult<ProjectEnvLogDto>>(
    routes.apiRoutes.projectEnvLogInfo({
      projectId: urlParams.projectId,
      envId: urlParams.envId,
      projectEnvLogSeq: urlParams.seq,
    })
    ,
    {
      onSuccess: (ar) => {
        // 如果日志已完成，那么停止轮训
        if (ar?.result?.isFinish) {
          projectEnvLogInfoUseRequest.cancel();
        }
        return ar;
      },
      ready: !!urlParams.projectId && !!urlParams.envId && !!urlParams.seq,
      manual: false,
      pollingWhenHidden:false,
      pollingInterval: 1000,
      refreshOnWindowFocus: false,
    });


  const buildingLogList = projectEnvLogListUseRequest.data?.result?.filter((projectEnvLog) => !projectEnvLog.isFinish);

  const buildingLogMenu = buildingLogList?.map((projectEnvLog) => {
    return <Menu.Item key={projectEnvLog.projectEnvLogSeq}>
      <Link
        to={routes.pageRoutes.projectEnvLogInfoParams(projectEnvLog.projectId, projectEnvLog.envId, projectEnvLog.projectEnvLogSeq)}>
        #{projectEnvLog.projectEnvLogSeq}
      </Link>
    </Menu.Item>;
  });

  const historyLogList = projectEnvLogListUseRequest.data?.result?.filter((projectEnvLog) => projectEnvLog.isFinish);
  const historyLogMenu = historyLogList?.map((projectEnvLog) => {
    return <Menu.Item key={projectEnvLog.projectEnvLogSeq}>
      <Link
        to={routes.pageRoutes.projectEnvLogInfoParams(projectEnvLog.projectId, projectEnvLog.envId, projectEnvLog.projectEnvLogSeq)}>
        #{projectEnvLog.projectEnvLogSeq}
      </Link>
    </Menu.Item>;
  });


  return (
    <PageHeaderWrapper
      title={`项目：${projectInfoUseRequest.data?.result?.name}`}
    >
      <Layout>
        <Sider theme='light'

        >
          <Row justify={'center'} style={{ padding: '30px' }}>
            <Select defaultValue={urlParams.envId} style={{ width: '120px' }}
                    onChange={(value, option) => {
                      // @ts-ignore
                      const projectEnvLogPageUrlParams = option?.prop as ProjectEnvLogPageUrlParams;
                      history.replace(routes.pageRoutes.projectEnvLogInfoParams(projectEnvLogPageUrlParams.projectId, projectEnvLogPageUrlParams.envId));
                    }}
            >
              {
                projectEnvListUseRequest.data?.result?.map(projectEnv => <Select.Option key={projectEnv.id}
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
            defaultSelectedKeys={[urlParams.seq]}
            mode="inline"
            theme='light'
          >
            <Menu.SubMenu
              key="building"
              title={
                buildingLogList && buildingLogList.length > 0 ?
                  <div><LoadingOutlined/>正在构建（{buildingLogList?.length} 个）</div> :
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
          projectEnvLogInfoUseRequest.data?.result ?
            <Layout>
              <Header style={{ padding: '0 20px', height: 'auto',backgroundColor:'#ffffff' }}>
                <Row>
                  <Col sm={12}>时间：{momentFormat(projectEnvLogInfoUseRequest.data?.result?.createdAt)}</Col>
                  <Col sm={12}>类型：{projectEnvLogInfoUseRequest.data?.result?.typeDesc}</Col>

                </Row>
                <Row>
                  <Col sm={12}>服务器：{projectEnvLogInfoUseRequest.data?.result?.serverIp}</Col>
                  <Col sm={12}>版本：{projectEnvLogInfoUseRequest.data?.result?.publishVersion}</Col>
                </Row>
              </Header>
              <Content>
                <div style={{ wordWrap: 'break-word', padding: '20px 20px 10px 20px' }}
                     dangerouslySetInnerHTML={{ __html: projectEnvLogInfoUseRequest.data?.result?.text?.toString() }}/>
                {
                  !projectEnvLogInfoUseRequest.data?.result?.isFinish
                    ? <div style={{ padding: '0px 20px 10px 20px' }}>
                      <LoadingOutlined style={{ fontSize: '20px' }}/>
                    </div>
                    : ''
                }
              </Content>
            </Layout>
            : (!projectEnvLogInfoUseRequest.data?.result && !historyLogList) ?
            <div style={{ width: '100%', textAlign: 'center' }}>无构建日志</div> :
            <PageLoading/>
        }
      </Layout>
    </PageHeaderWrapper>
  );
}

