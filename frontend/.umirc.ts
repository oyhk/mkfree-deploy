import { IConfig } from 'umi-types';
import { PageLoading } from '@ant-design/pro-layout';
// ref: https://umijs.org/config/

const config: IConfig = {
  // @ts-ignore
  title: 'MKfree Deploy',
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
          component: '@/pages/Welcome',
        },
        {
          path:'/project',
          component: '@/pages/project/ProjectIndex'
        },{
          path:'/project/edit/1',
          component: '@/pages/project/ProjectEdit'
        },
      ],
    },
  ],
};

export default config;
