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
              key:'user', // 用于点击子菜单，菜单栏选中父级菜单
              menu: {
                name: '用户',
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.userIndex,
                  title: '用户',
                  component: '@/pages/user/UserIndex',
                  icon:'UserOutlined',
                  key:'user', // 用选中同一个菜单
                  menu: {
                    name: '用户',
                  },
                },
                {
                  path: routes.pageRoutes.userCreate,
                  title: '用户创建',
                  component: '@/pages/user/UserCreate',
                  key:'user',
                  hideInMenu:true,
                  menu:{
                    name:'用户创建',
                  }
                },
                {
                  path: routes.pageRoutes.userEdit,
                  title: '用户编辑',
                  component: '@/pages/user/UserEdit',
                  key:'user',
                  hideInMenu:true,
                  menu:{
                    name:'用户编辑',
                  }
                },
              ],
            },

            // 环境模块
            {
              path: routes.pageRoutes.envIndex,
              title: '环境',
              key:'env',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.envIndex,
                  title: '环境',
                  component: '@/pages/env/EnvIndex',
                  icon:'EnvironmentOutlined',
                  key:'env',
                  menu: {
                    name: '环境',
                    flatMenu: true,
                  },
                },
                {
                  path: routes.pageRoutes.envCreate,
                  title: '环境创建',
                  component: '@/pages/env/EnvCreate',
                  key:'env',
                  hideInMenu:true,
                  menu:{
                    name:'环境创建',
                  }
                },
                {
                  path: routes.pageRoutes.envEdit,
                  title: '环境编辑',
                  component: '@/pages/env/EnvEdit',
                  key:'env',
                  hideInMenu:true,
                  menu:{
                    name:'环境编辑',
                  }
                },
              ],
            },

            // 服务器模块
            {
              path: routes.pageRoutes.serverIndex,
              title: '服务器',
              key:'server',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  path: routes.pageRoutes.serverIndex,
                  title: '服务器',
                  component: '@/pages/server/ServerIndex',
                  icon:'CloudServerOutlined',
                  key:'server',
                  menu: {
                    name: '服务器',
                    flatMenu: true,
                  },
                },
                {
                  path: routes.pageRoutes.serverCreate,
                  title: '服务器创建',
                  component: '@/pages/server/ServerCreate',
                  key:'server',
                  hideInMenu:true,
                  menu:{
                    name:'服务器创建',
                  }
                },
                {
                  path: routes.pageRoutes.serverEdit,
                  title: '服务器编辑',
                  component: '@/pages/server/ServerEdit',
                  key:'server',
                  hideInMenu:true,
                  menu:{
                    name:'服务器编辑',
                  }
                },
              ],
            },

            // 项目模块
            {
              path: routes.pageRoutes.projectIndex,
              title: '项目',
              key:'project',
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
                  key:'project',
                  menu: {
                    name: '项目',
                    flatMenu: true,
                  },
                },
                {
                  title: '项目编辑',
                  path: routes.pageRoutes.projectEdit,
                  component: '@/pages/project/ProjectEdit',
                  key:'project',
                  hideInMenu:true,
                  menu:{
                    name:'项目编辑',
                  }
                },
                {
                  title: '项目创建',
                  path: routes.pageRoutes.projectCreate,
                  component: '@/pages/project/ProjectCreate',
                  key:'project',
                  hideInMenu:true,
                  menu:{
                    name:'项目创建',
                  }
                },
                // 项目环境日志模块
                {
                  path: routes.pageRoutes.projectEnvLogIndex,
                  title: '项目环境日志',
                  component: '@/pages/project/ProjectEnvLogIndex',
                  key:'project',
                  hideInMenu:true,
                  menu:{
                    name:'项目环境日志',
                  }
                },
                {
                  path: routes.pageRoutes.projectEnvLogInfo,
                  title: '项目环境日志详情',
                  component: '@/pages/project/ProjectEnvLogIndex',
                  key:'project',
                  hideInMenu:true,
                  menu:{
                    name:'项目环境日志详情',
                  }
                },
              ],
            },

            // 版本计划模块
            {
              path: routes.pageRoutes.planIndex,
              title: '版本计划',
              key:'plan',
              menu: {
                flatMenu: true,
              },
              routes: [
                {
                  title: '版本计划',
                  path: routes.pageRoutes.planIndex,
                  component: '@/pages/plan/PlanIndex',
                  icon:'PushpinOutlined',
                  key:'plan',
                  menu: {
                    name: '版本计划',
                    flatMenu: true,
                  },
                },
                {
                  title: '版本计划编辑',
                  path: routes.pageRoutes.planEdit,
                  component: '@/pages/plan/PlanEdit',
                  key:'plan',
                  hideInMenu:true,
                  menu:{
                    name:'版本计划编辑',
                  }
                },
                {
                  title: '版本计划项目排序配置',
                  path: routes.pageRoutes.planProjectSort,
                  component: '@/pages/plan/PlanProjectSort',
                  key:'plan',
                  hideInMenu:true,
                  menu:{
                    name:'版本计划项目排序配置',
                  }
                },
                {
                  title: '版本计划创建',
                  path: routes.pageRoutes.planCreate,
                  component: '@/pages/plan/PlanCreate',
                  key:'plan',
                  hideInMenu:true,
                  menu:{
                    name:'版本计划创建',
                  }
                },
                {
                  title: '版本计划信息',
                  path: routes.pageRoutes.planInfo,
                  component: '@/pages/plan/PlanInfo',
                  key:'plan',
                  exact: true,
                  hideInMenu:true,
                  menu:{
                    name:'版本计划信息',
                  }
                },
              ],
            },
            //插件模块
            {
              path: routes.pageRoutes.pluginEurekaIndex,
              title: '插件',
              icon:'AppstoreOutlined',
              key:'plugin',
              menu: {
                name: '插件',
              },
              routes: [
                {
                  path: routes.pageRoutes.pluginEurekaIndex,
                  title: 'Eureka',
                  component: '@/pages/plugin/eureka/EurekaIndex',
                  key:'plugin',
                  menu:{
                    name:'Eureka',
                  }
                },
                {
                  path: routes.pageRoutes.pluginEurekaEnvIndex,
                  title: 'Eureka环境列表',
                  component: '@/pages/plugin/eureka/EurekaEnvIndex',
                  key:'plugin',
                  hideInMenu:true,
                  menu:{
                    name:'Eureka环境列表',
                  }
                },
                {
                  path: routes.pageRoutes.pluginEurekaEnvSetting,
                  title: 'Eureka环境配置',
                  component: '@/pages/plugin/eureka/EurekaEnvSetting',
                  key:'plugin',
                  hideInMenu:true,
                  menu:{
                    name:'Eureka环境配置',
                  }
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
