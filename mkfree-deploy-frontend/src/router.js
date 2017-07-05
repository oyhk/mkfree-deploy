/* eslint-disable react/jsx-space-before-closing */
import React from 'react';
import {Router, Route} from 'dva/router';
import {MainLayout, ProjectRoute, SignInRoute} from './routes';


const route_prefix = '';
const route_sign_in = `${route_prefix}/sign_in`;
const route_project = `${route_prefix}/project`;


function RouterConfig({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={MainLayout}>
                <Route path="deploy/project" component={ProjectRoute}/>
            </Route>
        </Router>
    );
}

export default RouterConfig;
