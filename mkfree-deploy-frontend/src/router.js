import React from 'react';
import {Router, Route} from 'dva/router';
import {
    MainLayout,
    ProjectBuildLogRoute,
    ProjectRoute,
    ProjectEditRoute,
    ProjectAddRoute,
    SignInRoute,
    UserRoute,
    UserEditRoute
} from './routes';
import {route} from './Constant';


function RouterConfig({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={MainLayout}>
                <Route path={route.project.url} component={ProjectRoute}/>
                <Route path={route.projectEdit} component={ProjectEditRoute}/>
                <Route path={route.projectAdd} component={ProjectAddRoute}/>
                <Route path={route.projectBuildLog} component={ProjectBuildLogRoute}/>

                <Route path={route.user.url} component={UserRoute}/>
                <Route path={route.userEdit.url} component={UserEditRoute}/>
            </Route>
            <Route path={route.signIn} component={SignInRoute}/>


        </Router>
    );
}

export default RouterConfig;
