import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Col, Layout, Menu, Row, Select, Tree, Checkbox } from 'antd';
import { useParams } from 'umi';
import { history } from '@@/core/history';
import routes from '@/routes';
import { momentFormat } from '@/utils/utils';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { ProjectDto } from '@/services/dto/ProjectDto';

const { Sider, Content, Header } = Layout;

export default () => {

  const [treeProjectList, setTreeProjectList] = useState();

  useRequest<ApiResult<ProjectDto[]>>(
    () => routes.apiRoutes.planProjectList(),
    {
      onSuccess: (apiResult, params) => {
        if (apiResult.result) {
          // eslint-disable-next-line no-unused-expressions
          setTreeProjectList(apiResult.result?.map((projectDto: ProjectDto) => ({
            title: projectDto.name,
            key: projectDto.id,
          })));
        }
      },
      manual: false,
      refreshOnWindowFocus: false,
    });


  return (
    <PageHeaderWrapper
      title={`项目计划创建`}
    >
      <Layout>
        <Sider theme='light'
               width='21%'
        >
          <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            <Tree
              checkable
              treeData={treeProjectList}
            />
          </Row>
        </Sider>
        <Content style={{ padding: '10px 10px' }}>
          <div>
            <h2>基本信息</h2>
            <Row>
              <Checkbox.Group
                options={['Apple', 'Pear', 'Orange']}
                defaultValue={['Apple']}
              />
            </Row>
          </div>
          <div>
            <h2>公共配置</h2>
          </div>
        </Content>
      </Layout>
    </PageHeaderWrapper>
  );
};
