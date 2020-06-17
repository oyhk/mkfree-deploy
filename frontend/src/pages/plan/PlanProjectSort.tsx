import React, { useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Button, Form, Input, notification } from 'antd';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { ProjectDto } from '@/services/dto/ProjectDto';
import routes from '@/routes';
import { PlanProjectSortDto } from '@/services/dto/PlanProjectSortDto';
import { uuid } from '@/utils/utils';
import { history } from '@@/core/umiExports';



export default () => {

  const { data, loading } = useRequest<ApiResult<PlanProjectSortDto[]>>(
    () => routes.apiRoutes.planProjectSortList(),
    {
      manual: false,
      refreshOnWindowFocus: false,
    });

  const editUseRequest = useRequest<ApiResult<any>>(
    (payload) => routes.apiRoutes.planProjectSortSetting(payload),
    {
      onSuccess: (apiResult) => {
        if (apiResult.code === 1) {
          notification.success({
            message: `版本计划项目排序`,
            description: '配置成功',
          });
          history.replace(routes.pageRoutes.planIndex);
        }
      },
      manual: true,
      refreshOnWindowFocus: false,
    });


  if (loading) {
    return <PageLoading/>;
  }


  return (
    <PageHeaderWrapper title={'版本计划项目排序配置'}>
      <Form
        initialValues={{ projectSortList: data?.result }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={(payload) => {
          console.log('project submit payload : ', payload.projectSortList);
          editUseRequest.run(payload.projectSortList);
        }}
      >
        <Form.List name="projectSortList">
          {
            (fields, { add, remove }) => {
              if (data && data.result && data.result.length > 0) {
                data.result.forEach((projectSort, projectSortIndex) => {
                  fields[projectSortIndex].record = projectSort;
                });
              }
              return (
                <div>
                  {fields.map(field => <div key={uuid()}>
                      <Form.Item name='id' noStyle>
                        <Input type='hidden'/>
                      </Form.Item>
                      <Form.Item name='projectId' noStyle>
                        <Input type='hidden'/>
                      </Form.Item>
                      <Form.Item label={field.record.projectName}
                                 name={[field.name, 'sort']}
                      >
                        <Input placeholder='项目排序（从0开始，升序排列）'/>
                      </Form.Item>


                    </div>,
                  )}
                </div>
              );
            }
          }
        </Form.List>
        <Form.Item label=' ' colon={false} style={{ marginTop: '10vh' }}>
          <Button type="primary" htmlType="submit" block
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
}
