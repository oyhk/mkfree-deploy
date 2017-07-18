import React from 'react';
import {Router, Route} from 'dva/router';
import {MainLayout, ProjectRoute, ProjectEditRoute, ProjectAddRoute, SignInRoute} from './routes';
import {route} from './Constant';


function RouterConfig({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={MainLayout}>
                <Route path={route.project} component={ProjectRoute}/>
                <Route path={route.projectEdit} component={ProjectEditRoute}/>
                <Route path={route.projectAdd} component={ProjectAddRoute}/>
            </Route>
            <Route path={route.signIn} component={SignInRoute}/>
        </Router>
    );
}

export default RouterConfig;
