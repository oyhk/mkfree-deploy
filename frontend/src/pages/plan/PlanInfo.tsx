import React, { useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Button, Checkbox, Col, Form, Input, Layout, Radio, Row, Select, Switch, Tree } from 'antd';
import { PlanEnvProjectConfigDto, PlanEnvProjectConfigType } from '@/services/dto/PlanEnvProjectConfigDto';
import { uuid } from '@/utils/utils';
import { PlanScriptDto } from '@/services/dto/PlanScriptDto';
import { USER_KEY } from '@/services/dto/UserDto';
import { PlanEnvDto } from '@/services/dto/PlanEnvDto';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { PlanProjectSortDto } from '@/services/dto/PlanProjectSortDto';
import routes from '@/routes';
import { PlanDto } from '@/services/dto/PlanDto';
import { useParams } from 'umi';

const { Sider, Content } = Layout;

export default () => {


  const [planProjectSortList, setPlanProjectSortList] = useState();
  const [plan, setPlan] = useState();

  useRequest<ApiResult<PlanProjectSortDto[]>>(
    () => routes.apiRoutes.planProjectSortList(),
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          setPlanProjectSortList(apiResult.result?.map((planProjectSortDto: PlanProjectSortDto) => ({
            title: planProjectSortDto.projectName,
            key: planProjectSortDto.projectId,
            projectSort: planProjectSortDto.sort,
          })));
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  const pathParams = useParams();

  useRequest<ApiResult<PlanDto>>(
    () => routes.apiRoutes.planInfo(pathParams),
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          setPlan(apiResult.result);
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });

  if (!planProjectSortList) {
    return <PageLoading/>;
  }

  if (!plan) {
    return <PageLoading/>;
  }

  return (
    <PageHeaderWrapper title={'版本计划信息'}>
      <Layout>
        <Sider theme='light'
               width='21%'
        >
          <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            <Tree
              treeData={planProjectSortList}
              multiple={true}
              defaultSelectedKeys={(plan.planEnvList.length > 0 ? plan.planEnvList[0].planEnvProjectConfigList?.map((planEnvProjectConfig: PlanEnvProjectConfigDto) => planEnvProjectConfig.projectId) : []) as number[]}
            />
          </Row>
        </Sider>
        <Content style={{ padding: '0px 10px' }}>
          {/*基本信息*/}
          <div>
            <h2>基本信息</h2>
            <Row style={{ marginBottom: '24px' }}>
              <Col xl={4} style={{
                textAlign: 'right',
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.85)',
              }}>版本计划名称：</Col>
              <Col xl={16}>
                {plan.name}
              </Col>
            </Row>
          </div>
          {/*相关脚本*/}
          <div>
            <h2>相关脚本</h2>
            {
              plan.planScriptList.map((planScript: PlanScriptDto, planScriptListIndex: number) =>
                <div key={planScript.id}>
                  <Row>
                    <Col xl={4} style={{
                      textAlign: 'right',
                      fontSize: '14px',
                      color: 'rgba(0, 0, 0, 0.85)',
                    }}>脚本（{planScriptListIndex + 1}）：</Col>
                    <Col xl={16} style={{ textAlign: 'left' }}>
                      {planScript.username}
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: '24px' }}>
                    <Col xl={4} style={{
                      textAlign: 'right',
                      fontSize: '14px',
                      color: 'rgba(0, 0, 0, 0.85)',
                    }}>内容：</Col>
                    <Col xl={16} style={{ textAlign: 'left' }}
                         dangerouslySetInnerHTML={{ __html: planScript?.text?.replace(/\r|\n/g, '<br />') }}/>
                  </Row>
                </div>,
              )
            }
          </div>
          <div>
            <h2>环境</h2>
            {
              plan.planEnvList.map((planEnv: PlanEnvDto) =>
                <div key={uuid()}>
                  <Row style={{ marginBottom: '24px', paddingTop: '30px' }}>
                    <Col xl={4}>
                      <h3>&nbsp;&nbsp;{planEnv.envName}</h3>
                    </Col>
                  </Row>
                  {
                    planEnv.planEnvProjectConfigList.map((planEnvProjectConfig) =>
                      <div key={uuid()}>
                        <Row>
                          <Col xl={20}>
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;{planEnvProjectConfig.projectName}
                              {
                                planEnvProjectConfig.projectId !== 0 && planEnvProjectConfig.isEnableCustomConfig ?
                                  <span>（使用自定义配置）</span> : ''

                              }
                            </h4>
                          </Col>
                        </Row>

                        {
                          planEnvProjectConfig.isEnableCustomConfig ?
                            <div>
                              <Row>
                                <Col xl={4} style={{
                                  textAlign: 'right',
                                  fontSize: '14px',
                                  color: 'rgba(0, 0, 0, 0.85)',
                                }}>发布分支：</Col>
                                <Col xl={16}>{planEnvProjectConfig.publishBranch}</Col>
                              </Row>
                              <Row style={{ marginBottom: '24px' }}>
                                <Col xl={4} style={{
                                  textAlign: 'right',
                                  fontSize: '14px',
                                  color: 'rgba(0, 0, 0, 0.85)',
                                }}>发布服务器：</Col>
                                <Col xl={16}>{planEnvProjectConfig.publishServerName}</Col>
                              </Row>
                            </div>
                            :
                            ''
                        }


                      </div>,
                    )
                  }


                </div>,
              )
            }

          </div>
        </Content>
      </Layout>

    </PageHeaderWrapper>
  );

}
