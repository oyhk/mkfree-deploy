import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Col, Layout, Menu, Row, Select, Tree } from 'antd';
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

  const projectListUseRequest = useRequest<ApiResult<ProjectDto[]>>(() => routes.apiRoutes.planProjectList()
    ,
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
        >
          <Row>
            <Tree
              checkable
              treeData={treeProjectList}
            />
          </Row>
        </Sider>
        <Layout>
          <Header style={{ padding: '0 20px', height: 'auto' }}>
            header
          </Header>
          <Content>
            content
          </Content>
        </Layout>
      </Layout>
    </PageHeaderWrapper>
  );
};
