import { IConfig } from 'umi-types';
import { PageLoading } from '@ant-design/pro-layout';
import routes from './src/routes';
// ref: https://umijs.org/config/

const config: IConfig = {
  // @ts-ignore
  title: 'MKfree Deploy',
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
      path: routes.pageRoutes.root,
      component: '@/layouts/BlankLayout',
      routes: [
        // 系统模块

        {
          path: routes.pageRoutes.installIndex,
          title: '系统安装',
          component: '@/pages/install/installIndex',
        },

        {
          path: routes.pageRoutes.userLogin,
          title: '用户登录',
          component: '@/pages/user/UserLogin',
        },

        {
          path: routes.pageRoutes.root,
          component: '@/layouts/BaseLayout',
          routes: [
            // 欢迎模块
            {
              path: routes.pageRoutes.root,
              title: '欢迎',
              component: '@/pages/Welcome',
            },
            // 项目模块
            {
              path: routes.pageRoutes.projectIndex,
              title: '项目',
              routes: [
                // 项目模块
                {
                  title: '项目管理',
                  path: routes.pageRoutes.projectIndex,
                  component: '@/pages/project/ProjectIndex',
                },
                {
                  title: '项目编辑',
                  path: routes.pageRoutes.projectEdit,
                  component: '@/pages/project/ProjectEdit',
                },
                {
                  title: '项目创建',
                  path: routes.pageRoutes.projectCreate,
                  component: '@/pages/project/ProjectCreate',
                },
                // 项目环境日志模块
                {
                  path: routes.pageRoutes.projectEnvLogIndex,
                  title: '项目环境日志',
                  component: '@/pages/project/ProjectEnvLogIndex',
                },
                {
                  path: routes.pageRoutes.projectEnvLogInfo,
                  title: '项目环境日志',
                  component: '@/pages/project/ProjectEnvLogIndex',
                },
              ],
            },
            // 用户模块
            {
              path: routes.pageRoutes.userIndex,
              title: '用户',
              routes: [
                {
                  path: routes.pageRoutes.userIndex,
                  title: '用户',
                  component: '@/pages/user/UserIndex',
                },
                {
                  path: routes.pageRoutes.userCreate,
                  title: '用户创建',
                  component: '@/pages/user/UserCreate',
                },
                {
                  path: routes.pageRoutes.userEdit,
                  title: '用户编辑',
                  component: '@/pages/user/UserEdit',
                },
              ],
            },
            // 服务器模块
            {
              path: routes.pageRoutes.serverIndex,
              title: '服务器',
              routes: [
                {
                  path: routes.pageRoutes.serverIndex,
                  title: '服务器',
                  component: '@/pages/server/ServerIndex',
                },
                {
                  path: routes.pageRoutes.serverCreate,
                  title: '服务器创建',
                  component: '@/pages/server/ServerCreate',
                },
                {
                  path: routes.pageRoutes.serverEdit,
                  title: '服务器编辑',
                  component: '@/pages/server/ServerEdit',
                },
              ],
            },
            // 环境模块
            {
              path: routes.pageRoutes.envIndex,
              title: '环境',
              routes: [
                {
                  path: routes.pageRoutes.envIndex,
                  title: '环境',
                  component: '@/pages/env/EnvIndex',
                },
                {
                  path: routes.pageRoutes.envCreate,
                  title: '环境创建',
                  component: '@/pages/env/EnvCreate',
                },
                {
                  path: routes.pageRoutes.envEdit,
                  title: '环境编辑',
                  component: '@/pages/env/EnvEdit',
                },
              ],
            },
          ],
        },
      ],
    },


  ],
};

export default config;
