import React from 'react';
import {Router, Route} from 'dva/router';
import {
    ProjectBuildLogRoute,
    ProjectRoute,
    InstallRoute,
    ProjectEditRoute,
    ProjectAddRoute,
    SignInRoute,
    EnvRoute,
    EnvEditRoute,
    EnvAddRoute,
    UserProjectPermissionRoute,
    UserRoute,
    UserEditRoute,
    ServerMachineRoute,
    ServerMachineAddRoute,
    ServerMachineEditRoute,
    MainLayout,
} from './routes';
import {route} from './Constant';


function RouterConfig({history}) {
    return (
        <Router history={history}>
            {/* 系统安装 */}
            <Route path={route.install.url} component={InstallRoute}/>
            {/* 登录 */}
            <Route path={route.signIn.url} component={SignInRoute}/>
            <Route path="/" component={MainLayout}>
                <Route path={route.project.url} component={ProjectRoute}/>
                <Route path={route.projectEdit} component={ProjectEditRoute}/>
                <Route path={route.projectAdd} component={ProjectAddRoute}/>
                <Route path={route.projectBuildLog} component={ProjectBuildLogRoute}/>

                <Route path={route.userProjectPermission.url} component={UserProjectPermissionRoute}/>
                <Route path={route.user.url} component={UserRoute}/>
                <Route path={route.userEdit.url} component={UserEditRoute}/>

                <Route path={route.env.url} component={EnvRoute}/>
                <Route path={route.envAdd.url} component={EnvAddRoute}/>
                <Route path={route.envEdit.url} component={EnvEditRoute}/>

                <Route path={route.serverMachine.url} component={ServerMachineRoute}/>
                <Route path={route.serverMachineAdd.url} component={ServerMachineAddRoute}/>
                <Route path={route.serverMachineEdit.url} component={ServerMachineEditRoute}/>
            </Route>


        </Router>
    );
}
export default RouterConfig;
