import React from 'react';
import {Router, Route, IndexRoute, Link, IndexRedirect} from 'dva/router';
import MainLayout from './components/Mainlayout/MainLayout';
import Users from './routes/Users';
import Projects from './routes/Projects';
import ServerMachine from './routes/ServerMachine';
import UsersInfo from './routes/UserInfo';
import { ROUTE_ADMIN_USERS, ROUTE_PROJECTS, ROUTE_ServerMachine, ROUTE_ADMIN_USERS_INFO} from './constants';

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/">
                <Route path="/admin" component={MainLayout}>
                    <Route path={ROUTE_ADMIN_USERS} component={Users}/>
                    <Route path={ROUTE_ADMIN_USERS_INFO + '/:id'} component={UsersInfo}/>
                    <Route path={ROUTE_ADMIN_USERS_INFO + '/create'} component={UsersInfo}/>
                </Route>
                <Route path="/project" component={MainLayout}>
                    <Route path={ROUTE_PROJECTS} component={Projects}/>
                </Route>
                <Route path="/serverMachine" component={MainLayout}>
                    <Route path={ROUTE_ServerMachine} component={ServerMachine}/>
                </Route>
            </Route>
        </Router>
    );
};
