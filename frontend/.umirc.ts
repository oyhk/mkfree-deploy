import { IConfig } from 'umi-types';
import { PageLoading } from '@ant-design/pro-layout';
import routes from './src/routes';
// ref: https://umijs.org/config/

const config: IConfig = {
  // @ts-ignore
  title:'MKfree Deploy',
  // @ts-ignore
  antd: {
    dark: false, // 开启暗色主题
  },
  dva: {
    immer: true,
    hmr: false,
  },
  dynamicImport: {
    loading: '@/component/PageLoading/index',
  },
  crossorigin: true,
  routes: [
    {
      path: '/',
      component: '@/layouts/BaseLayout',
      routes: [
        {
          path: '/',
          title: '欢迎',
          component: '@/pages/Welcome',
        },
        {
          title: '项目管理',
          path: routes.pageRoutes.projectIndex,
          component: '@/pages/project/ProjectIndex',
        },
        {
          title:'项目编辑',
          path: routes.pageRoutes.projectEdit,
          component: '@/pages/project/ProjectEdit',
        },
      ],
    },
  ],
};

export default config;
