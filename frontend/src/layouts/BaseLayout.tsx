import React from 'react';
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link } from 'umi';

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return localItem as MenuDataItem;
  });

const BasicLayout: React.FC = props => {
  return (
    <ProLayout
      title='Mkfree Deploy'
      fixedHeader={true}
      fixSiderbar={true}
      menuDataRender={() => [
        {
          icon: <StarOutlined/>,
          name: '欢迎',
          key: 'welcome',
          path: '/',
        },
        {
          icon: <StarOutlined/>,
          name: '项目管理',
          key: 'projectParent',
          children:[{
            name: '列表',
            key: 'project',
            path:'/project'
          }]
        },
      ]}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuRender={(_, dom) => dom}
    >

      {props.children}
    </ProLayout>
  );
};

export default BasicLayout;
