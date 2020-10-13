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
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: false,
    title: false
  },
  layout: {
    name: 'MKfree Deploy',
    locale: false,
  },
  dva: false,
  dynamicImport: {
    loading: '@/component/PageLoading/index',
  },
  crossorigin: true,
  routes: [
    {
      // 父类模板
      path: routes.pageRoutes.root,
      component: '@/layouts/BlankLayout',
      menu: {
        flatMenu: true,
      },
      routes: [

        // 不需要菜单页面
        {
          path: routes.pageRoutes.installIndex,
          title: '系统安装',
          component: '@/pages/install/installIndex',
          layout: {
            hideNav: true,
            hideMenu: true,
          },
        },
        {
          path: routes.pageRoutes.userLogin,
          title: '用户登录',
          component: '@/pages/user/UserLogin',
          layout: {
            hideNav: true,
            hideMenu: true,
          },
        },

        // 需要菜单页面
        {
          path: routes.pageRoutes.root,
          menu: {
            flatMenu: true,
          },
          routes: [
            // 欢迎模块
            {
              path: routes.pageRoutes.root,
              title: '欢迎',
              component: '@/pages/Welcome',
              icon:'SmileOutlined',
              menu: {
                name: '欢迎',
                flatMenu: true,
              },
            },



            // 用户模块
            {
              path: routes.pageRoutes.userIndex,
              title: '用户',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.userIndex,
                  title: '用户',
                  component: '@/pages/user/UserIndex',
                  icon:'UserOutlined',
                  menu: {
                    name: '用户',
                    flatMenu: true,
                  },
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

            // 环境模块
            {
              path: routes.pageRoutes.envIndex,
              title: '环境',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.envIndex,
                  title: '环境',
                  component: '@/pages/env/EnvIndex',
                  icon:'EnvironmentOutlined',
                  menu: {
                    name: '环境',
                    flatMenu: true,
                  },
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

            // 服务器模块
            {
              path: routes.pageRoutes.serverIndex,
              title: '服务器',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.serverIndex,
                  title: '服务器',
                  component: '@/pages/server/ServerIndex',
                  icon:'CloudServerOutlined',
                  menu: {
                    name: '服务器',
                    flatMenu: true,
                  },
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

            // 项目模块
            {
              path: routes.pageRoutes.projectIndex,
              title: '项目',
              menu: {
                flatMenu: true,
              },
              routes: [
                // 项目模块
                {
                  title: '项目',
                  path: routes.pageRoutes.projectIndex,
                  component: '@/pages/project/ProjectIndex',
                  icon:'DeploymentUnitOutlined',
                  menu: {
                    name: '项目',
                    flatMenu: true,
                  },
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

            // 版本计划模块
            {
              path: routes.pageRoutes.planIndex,
              title: '版本计划',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  title: '版本计划',
                  path: routes.pageRoutes.planIndex,
                  component: '@/pages/plan/PlanIndex',
                  icon:'PushpinOutlined',
                  menu: {
                    name: '版本计划',
                    flatMenu: true,
                  },
                },
                {
                  title: '版本计划编辑',
                  path: routes.pageRoutes.planEdit,
                  component: '@/pages/plan/PlanEdit',
                },
                {
                  title: '版本计划项目排序配置',
                  path: routes.pageRoutes.planProjectSort,
                  component: '@/pages/plan/PlanProjectSort',
                },
                {
                  title: '版本计划创建',
                  path: routes.pageRoutes.planCreate,
                  component: '@/pages/plan/PlanCreate',
                },
                {
                  title: '版本计划信息',
                  path: routes.pageRoutes.planInfo,
                  component: '@/pages/plan/PlanInfo',
                  exact: true,
                },
              ],
            },
            //插件模块
            {
              path: routes.pageRoutes.pluginEurekaIndex,
              title: '插件',
              icon:'AppstoreOutlined',
              menu: {
                name: '插件',
              },
              routes: [
                {
                  path: routes.pageRoutes.pluginEurekaIndex,
                  title: 'Eureka',
                  component: '@/pages/plugin/eureka/EurekaIndex',

                  menu: {
                    name: 'Eureka',
                  },
                },
                {
                  path: routes.pageRoutes.pluginEurekaEnvIndex,
                  title: 'Eureka',
                  component: '@/pages/plugin/eureka/EurekaEnvIndex',
                },
                {
                  path: routes.pageRoutes.pluginEurekaEnvSetting,
                  title: 'Eureka环境配置',
                  component: '@/pages/plugin/eureka/EurekaEnvSetting',
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
