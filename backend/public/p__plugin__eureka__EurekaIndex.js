(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"/xke":function(e,t,n){"use strict";n("cIOH"),n("rSSe")},gLBg:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n("s4NR"),r="/",o="",i={get:"get",post:"post",put:"put",delete:"delete"};t["b"]={pageRoutes:{root:"/",installIndex:o+"/install",projectIndex:o+"/project",projectEdit:o+"/project/edit/:id",projectEditParams:e=>o+"/project/edit/".concat(e),projectCreate:o+"/project/create",projectEnvLogIndex:o+"/project/:projectId/env/:envId/log",projectEnvLogInfo:o+"/project/:projectId/env/:envId/log/:seq",projectEnvLogInfoParams:(e,t,n)=>{var a=o+"/project/".concat(e,"/env/").concat(t,"/log");return n&&(a=o+"/project/".concat(e,"/env/").concat(t,"/log/").concat(n)),a},planIndex:o+"/plan",planProjectSort:o+"/plan/project-sort",planCreate:o+"/plan/create",planInfo:o+"/plan/:id",planInfoParams:e=>o+"/plan/".concat(e),planEdit:o+"/plan/edit/:id",planEditParams:e=>o+"/plan/edit/".concat(e),userIndex:o+"/user",userCreate:o+"/user/create",userEdit:o+"/user/edit/:id",userEditParams:e=>o+"/user/edit/".concat(e),userLogin:o+"/user/login",serverIndex:o+"/server",serverCreate:o+"/server/create",serverEdit:o+"/server/edit/:id",serverEditParams:e=>o+"/server/edit/".concat(e),envIndex:o+"/env",envCreate:o+"/env/create",envEdit:o+"/env/edit/:id",envEditParams:e=>o+"/env/edit/".concat(e),pluginEurekaIndex:o+"/plugin/eureka",pluginEurekaEnvIndex:o+"/plugin/eureka/envId/:id",pluginEurekaEnvIndexParams:e=>o+"/plugin/eureka/envId/".concat(e),pluginEurekaEnvSetting:o+"/plugin/eureka/env-setting"},apiRoutes:{systemInstall:{url:r+"api/systems/install",method:i.post},systemInstalled:{url:r+"api/systems/installed",method:i.get},projectPage:e=>({url:"".concat(r,"api/projects/page?").concat(a["stringify"](e)),method:i.get}),projectInfo:e=>({url:"".concat(r,"api/projects/info?").concat(a["stringify"](e)),method:i.get}),projectSave:e=>({url:"".concat(r,"api/projects/save"),method:i.post,data:e}),projectUpdate:e=>({url:"".concat(r,"api/projects/update"),method:i.put,data:e}),projectDeleted:r+"api/projects/deleted",projectBuild:e=>({url:"".concat(r,"api/projects/build"),method:i.post,data:e}),projectSync:e=>({url:"".concat(r,"api/projects/sync"),method:i.post,data:e}),projectInit:e=>({url:"".concat(r,"api/projects/init"),method:i.post,data:e}),projectRefreshBranch:e=>({url:"".concat(r,"api/projects/refreshBranch"),method:i.post,data:e}),envList:e=>({url:"".concat(r,"api/envs/list?").concat(a["stringify"](e)),method:i.get}),serverList:()=>({url:r+"api/servers/list",method:i.get}),projectEnvList:e=>({url:"".concat(r,"api/projectEnvs/list?").concat(a["stringify"](e)),method:i.get}),projectEnvInfo:r+"api/projectEnvs/info",projectEnvPluginInfo:e=>({url:"".concat(r,"api/projectEnvPlugins/info?").concat(a["stringify"](e)),method:i.get}),projectEnvPluginList:e=>({url:"".concat(r,"api/projectEnvPlugins/list?").concat(a["stringify"](e)),method:i.get}),projectEnvLogList:e=>({url:"".concat(r,"api/projectEnvLogs/list?").concat(a["stringify"](e))}),projectEnvLogInfo:e=>({url:"".concat(r,"api/projectEnvLogs/info?").concat(a["stringify"](e))}),userLogin:{url:r+"api/users/login",method:i.post},userPage:r+"api/users/page",userSave:r+"api/users/save",userInfo:r+"api/users/info",userDelete:{url:r+"api/users/delete",method:i.delete},userUpdate:r+"api/users/update",serverPage:{url:r+"api/servers/page",method:i.get},serverUpdate:{url:r+"api/servers/update",method:i.put},serverSave:{url:r+"api/servers/save",method:i.post},serverInfo:{url:r+"api/servers/info",method:i.get},serverDelete:{url:r+"api/servers/delete",method:i.delete},pluginEnvSettingInfo:e=>({url:"".concat(r,"api/pluginEnvSetting/info?").concat(a["stringify"](e)),method:i.get}),pluginEnvSettingList:e=>({url:"".concat(r,"api/pluginEnvSetting/list?").concat(a["stringify"](e)),method:i.get}),pluginEnvSettingSave:e=>({url:"".concat(r,"api/pluginEnvSetting/save"),method:i.post,data:e}),envPage:e=>({url:"".concat(r,"api/envs/page?").concat(a["stringify"](e)),method:i.get}),planPage:e=>({url:"".concat(r,"api/plans/page?").concat(a["stringify"](e)),method:i.get}),planProjectSortList:e=>({url:"".concat(r,"api/plans/project-sort-list?").concat(a["stringify"](e)),method:i.get}),planProjectSortSetting:e=>({url:"".concat(r,"api/plans/project-sort-setting"),method:i.post,data:e}),planInfo:e=>({url:"".concat(r,"api/plans/info?").concat(a["stringify"](e)),method:i.get}),planSave:e=>({url:"".concat(r,"api/plans/save"),method:i.post,data:e}),planUpdate:e=>({url:"".concat(r,"api/plans/update"),method:i.put,data:e}),planDelete:e=>({url:r+"api/envs/delete",method:i.delete,data:e}),planGrayPublish:e=>({url:"".concat(r,"api/plans/gray-publish"),method:i.post,data:e}),envUpdate:{url:r+"api/envs/update",method:i.put},envSave:{url:r+"api/envs/save",method:i.post},envInfo:{url:r+"api/envs/info",method:i.get},envDelete:{url:r+"api/envs/delete",method:i.delete},pluginList:e=>({url:"".concat(r,"api/plugin/list?").concat(a["stringify"](e)),method:i.get}),pluginEurekaList:e=>({url:"".concat(r,"api/plugin/eureka/list?").concat(a["stringify"](e)),method:i.get}),pluginEurekaStatus:e=>({url:"".concat(r,"api/plugin/eureka/status"),method:i.put,data:e})}}},rSSe:function(e,t,n){},"x+ba":function(e,t,n){"use strict";n.r(t);n("/xke");var a=n("TeRw"),r=n("q1tI"),o=n.n(r),i=n("tbuW"),s=n("gLBg"),p=n("0iz5");t["default"]=e=>(Object(p["b"])(s["b"].apiRoutes.pluginEnvSettingList({pluginName:"Eureka"}),{onSuccess:t=>{if(t.result&&0!==t.result.length){var n=t.result.filter(e=>e.defaultShow);if(!n||0===n.length)return e.history.replace(s["b"].pageRoutes.pluginEurekaEnvSetting),void a["a"].warn({message:"Eureka\u9ed8\u8ba4\u914d\u7f6e\u4e0d\u5b58\u5728",description:"\u8bf7\u5148\u8bbe\u7f6eEureka\u73af\u5883\u914d\u7f6e"});e.history.replace(s["b"].pageRoutes.pluginEurekaEnvIndexParams(n[0].envId))}else e.history.replace(s["b"].pageRoutes.pluginEurekaEnvSetting)},manual:!1,refreshOnWindowFocus:!1}),o.a.createElement(i["a"],null))}}]);