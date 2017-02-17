import React from "react";
import {Router, Route, IndexRedirect} from "dva/router";
import MainLayout from "./components/Mainlayout/MainLayout";
import Header from "./components/Mainlayout/Header";
import Users from "./routes/Users";
import Projects from "./routes/Projects";
import ProjectsHeader from "./components/Projects/ProjectsHeader";
import ProjectsCreate from "./routes/ProjectsCreate";
import ServerMachine from "./routes/ServerMachine";
import UsersInfo from "./routes/UserInfo";
import SsoIndex from "./routes/SsoIndex";
import {
    ROUTE_ADMIN_USERS,
    ROUTE_PROJECTS,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECTS_INFO,
    ROUTE_ServerMachine,
    ROUTE_ADMIN_USERS_INFO,
    ROUTE_USERS_SIGN_IN,
    ROUTE_JOB,
    ROUTE_ADMIN_USERS_CREATE
} from "./constants";

export default function ({history}) {
    return (
        <Router history={history}>
            <Route path="/" component={MainLayout}>
                <IndexRedirect to={ROUTE_PROJECTS}/>
                <Route path="/" component={Header}>
                    {/*admin*/}
                    <Route path={ROUTE_ADMIN_USERS} component={Users}/>
                    <Route path={ROUTE_ADMIN_USERS_CREATE} component={UsersInfo}/>
                    <Route path={ROUTE_ADMIN_USERS_INFO + '/:id'} component={UsersInfo}/>
                    {/*project*/}
                    <Route path={ROUTE_PROJECTS} component={Projects}/>
                    <Route path={ROUTE_PROJECTS_CREATE} component={ProjectsCreate}/>
                    <Route path={ROUTE_PROJECTS_INFO + '/:id'} component={ProjectsCreate}/>
                    {/*serverMachine*/}
                    <Route path={ROUTE_ServerMachine} component={ServerMachine}/>
                </Route>
                <Route path={ROUTE_JOB+'/:id'} component={ProjectsHeader}>
                </Route>
            </Route>
            <Route path={ROUTE_USERS_SIGN_IN} component={SsoIndex}/>
        </Router>
    );
};
