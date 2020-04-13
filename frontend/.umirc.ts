import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  // @ts-ignore
  antd: {
    dark: false, // 开启暗色主题
  },
  dva: {
    immer: true,
    hmr: false,
  },
  crossorigin: true,
  routes: [
    {
      path: '/',
      component: '@/layouts/BaseLayout',
      routes: [
        {
          path: '/',
          component: '../pages/index',
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
