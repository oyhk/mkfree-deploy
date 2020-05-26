import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import { Col, Layout, Menu, Row, Select, Tree, Checkbox, Form, Input, Button } from 'antd';
import { useParams } from 'umi';
import { history } from '@@/core/history';
import routes from '@/routes';
import { momentFormat, uuid } from '@/utils/utils';
import { useRequest } from '@umijs/hooks';
import { ApiResult } from '@/services/ApiResult';
import { ProjectDto } from '@/services/dto/ProjectDto';
import { ServerDto } from '@/services/dto/ServerDto';
import { ProjectEnvPluginDto } from '@/services/dto/ProjectEnvPluginDto';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { EnvDto } from '@/services/dto/EnvDto';
import PlanForm from '@/pages/plan/PlanForm';



export default () => {

  return (
    <PageHeaderWrapper
      title={`版本计划创建`}
    >
      <PlanForm/>
    </PageHeaderWrapper>
  );
};
