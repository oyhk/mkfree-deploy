import React from 'react';
import {Router, Route, IndexRoute, Link, IndexRedirect} from 'dva/router';
import MainLayout from './components/Mainlayout/MainLayout';
import Users from './routes/Users';
import Projects from './routes/Projects';
import ProjectsCreate from './routes/ProjectsCreate';
import ServerMachine from './routes/ServerMachine';
import UsersInfo from './routes/UserInfo';
import SsoIndex from './routes/SsoIndex';
import StructureLogs from './routes/StructureLogs';
import {
    ROUTE_ADMIN_USERS,
    ROUTE_PROJECTS,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECTS_INFO,
    ROUTE_ServerMachine,
    ROUTE_ADMIN_USERS_INFO,
    ROUTE_USERS_SIGN_IN,
    ROUTE_ADMIN_USERS_CREATE,
    ROUTE_PROJECT_STRUCTURE_LOGS,
    ROUTE_PROJECT_STRUCTURE_LOGS_INFO
} from './constants';

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/">
                <Route path="/admin" component={MainLayout}>
                    <Route path={ROUTE_ADMIN_USERS} component={Users}/>
                    <Route path={ROUTE_ADMIN_USERS_CREATE} component={UsersInfo}/>
                    <Route path={ROUTE_ADMIN_USERS_INFO + '/:id'} component={UsersInfo}/>
                </Route>
                <Route path="/project" component={MainLayout}>
                    <Route path={ROUTE_PROJECTS} component={Projects}/>
                    <Route path={ROUTE_PROJECTS_CREATE} component={ProjectsCreate}/>
                    <Route path={ROUTE_PROJECTS_INFO + '/:id'} component={ProjectsCreate}/>
                    <Route path={ROUTE_PROJECT_STRUCTURE_LOGS+ '/:id'} component={StructureLogs}/>
                    {/*<Route path={ROUTE_PROJECT_STRUCTURE_LOGS_INFO+ '/:id'} component={StructureLogsINFO}/>*/}
                </Route>
                <Route path="/serverMachine" component={MainLayout}>
                    <Route path={ROUTE_ServerMachine} component={ServerMachine}/>
                </Route>
                <Route path={ROUTE_USERS_SIGN_IN} component={SsoIndex}/>
            </Route>
        </Router>
    );
};
